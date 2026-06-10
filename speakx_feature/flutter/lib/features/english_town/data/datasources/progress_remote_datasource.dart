import 'package:grpc/grpc.dart';

// Generated from proto/english_town.proto:
//   protoc --dart_out=grpc:lib/generated proto/english_town.proto
// import '../../../../generated/english_town.pbgrpc.dart';

import '../../domain/entities/progress.dart';

/// Talks to the Golang EnglishTownService over gRPC.
///
/// NOTE: the generated client (`EnglishTownServiceClient`) and message types
/// come from protoc. The body below shows the intended wiring; swap the
/// pseudo-types for the generated ones once `protoc` has been run.
class ProgressRemoteDataSource {
  final ClientChannel _channel;

  // The SpeakX auth token is attached via call options metadata, matching how
  // the rest of the app authenticates gRPC calls.
  final String Function() _authToken;

  ProgressRemoteDataSource({
    required ClientChannel channel,
    required String Function() authToken,
  })  : _channel = channel,
        _authToken = authToken;

  CallOptions get _options => CallOptions(
        metadata: {'authorization': 'Bearer ${_authToken()}'},
        timeout: const Duration(seconds: 15),
      );

  Future<Progress> getProgress() async {
    // final client = EnglishTownServiceClient(_channel);
    // final res = await client.getProgress(GetProgressRequest(), options: _options);
    // return _fromProto(res);
    throw UnimplementedError('Run protoc and wire EnglishTownServiceClient');
  }

  Future<Progress> saveProgress(Progress progress) async {
    // final client = EnglishTownServiceClient(_channel);
    // final res = await client.saveProgress(
    //   SaveProgressRequest(progress: _toProto(progress)),
    //   options: _options,
    // );
    // return _fromProto(res);
    throw UnimplementedError('Run protoc and wire EnglishTownServiceClient');
  }

  // --- Mapping helpers (uncomment once generated types exist) ---
  //
  // Progress _fromProto(pb.Progress p) => Progress(
  //       currentId: p.currentId,
  //       completedIds: p.completedIds.toList(),
  //       coins: p.coins,
  //     );
  //
  // pb.Progress _toProto(Progress p) => pb.Progress(
  //       currentId: p.currentId,
  //       completedIds: p.completedIds,
  //       coins: p.coins,
  //     );
}
