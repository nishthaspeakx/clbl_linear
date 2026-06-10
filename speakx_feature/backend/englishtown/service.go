package englishtown

import (
	"context"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	// Generated from proto/english_town.proto via protoc.
	// Run: protoc --go_out=. --go-grpc_out=. proto/english_town.proto
	englishtownv1 "github.com/speakx/englishtown/gen/v1"
)

// Service implements the EnglishTownService gRPC server.
type Service struct {
	englishtownv1.UnimplementedEnglishTownServiceServer
	store *Store
}

func NewService(store *Store) *Service {
	return &Service{store: store}
}

// userIDFromContext pulls the authenticated user id from request metadata.
// Replace with SpeakX's real auth interceptor / context helper.
func userIDFromContext(ctx context.Context) (string, error) {
	uid, _ := ctx.Value(ctxKeyUserID).(string)
	if uid == "" {
		return "", status.Error(codes.Unauthenticated, "missing user id")
	}
	return uid, nil
}

type ctxKey string

const ctxKeyUserID ctxKey = "userID"

func (s *Service) GetProgress(ctx context.Context, _ *englishtownv1.GetProgressRequest) (*englishtownv1.Progress, error) {
	uid, err := userIDFromContext(ctx)
	if err != nil {
		return nil, err
	}
	doc, err := s.store.GetProgress(ctx, uid)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "get progress: %v", err)
	}
	return toProto(doc), nil
}

func (s *Service) SaveProgress(ctx context.Context, req *englishtownv1.SaveProgressRequest) (*englishtownv1.Progress, error) {
	uid, err := userIDFromContext(ctx)
	if err != nil {
		return nil, err
	}
	if req.GetProgress() == nil {
		return nil, status.Error(codes.InvalidArgument, "progress is required")
	}
	doc := fromProto(uid, req.GetProgress())
	saved, err := s.store.SaveProgress(ctx, doc)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "save progress: %v", err)
	}
	return toProto(saved), nil
}

func toProto(d progressDoc) *englishtownv1.Progress {
	return &englishtownv1.Progress{
		CurrentId:    d.CurrentID,
		CompletedIds: d.CompletedIDs,
		Coins:        d.Coins,
	}
}

func fromProto(userID string, p *englishtownv1.Progress) progressDoc {
	return progressDoc{
		UserID:       userID,
		CurrentID:    p.GetCurrentId(),
		CompletedIDs: p.GetCompletedIds(),
		Coins:        p.GetCoins(),
	}
}
