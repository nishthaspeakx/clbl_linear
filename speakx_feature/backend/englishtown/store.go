package englishtown

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// progressDoc is the MongoDB document shape for user_progress.
// Keyed by userId; one document per learner.
type progressDoc struct {
	UserID       string    `bson:"_id"`
	CurrentID    int32     `bson:"currentId"`
	CompletedIDs []int32   `bson:"completedIds"`
	Coins        int32     `bson:"coins"`
	UpdatedAt    time.Time `bson:"updatedAt"`
}

// Store wraps the Mongo collection for English Town progress.
// Reuse SpeakX's existing *mongo.Database here instead of constructing one.
type Store struct {
	progress *mongo.Collection
}

func NewStore(db *mongo.Database) *Store {
	return &Store{progress: db.Collection("user_progress")}
}

// EnsureIndexes should be called once at startup.
func (s *Store) EnsureIndexes(ctx context.Context) error {
	// _id (userId) is already unique; add others here as the schema grows.
	return nil
}

var defaultProgress = progressDoc{CurrentID: 1, CompletedIDs: []int32{}, Coins: 0}

// GetProgress returns the user's progress, or a sane default if none exists.
func (s *Store) GetProgress(ctx context.Context, userID string) (progressDoc, error) {
	var doc progressDoc
	err := s.progress.FindOne(ctx, bson.M{"_id": userID}).Decode(&doc)
	if err == mongo.ErrNoDocuments {
		d := defaultProgress
		d.UserID = userID
		return d, nil
	}
	if err != nil {
		return progressDoc{}, err
	}
	return doc, nil
}

// SaveProgress upserts the user's progress and returns the stored value.
func (s *Store) SaveProgress(ctx context.Context, doc progressDoc) (progressDoc, error) {
	doc.UpdatedAt = time.Now().UTC()
	if doc.CompletedIDs == nil {
		doc.CompletedIDs = []int32{}
	}
	_, err := s.progress.UpdateByID(
		ctx,
		doc.UserID,
		bson.M{"$set": bson.M{
			"currentId":    doc.CurrentID,
			"completedIds": doc.CompletedIDs,
			"coins":        doc.Coins,
			"updatedAt":    doc.UpdatedAt,
		}},
		options.Update().SetUpsert(true),
	)
	if err != nil {
		return progressDoc{}, err
	}
	return doc, nil
}
