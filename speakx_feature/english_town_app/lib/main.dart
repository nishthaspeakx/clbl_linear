import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'features/english_town/application/avatar_controller.dart';
import 'features/english_town/application/reward_controller.dart';
import 'features/english_town/data/datasources/progress_local_datasource.dart';
import 'features/english_town/data/repositories/local_progress_repository.dart';
import 'features/english_town/domain/repositories/progress_repository.dart';
import 'features/english_town/presentation/app_shell.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();

  // DI: the standalone build uses the local repository. To go full-stack,
  // swap this single line for the gRPC-backed ProgressRepositoryImpl.
  final ProgressRepository progressRepo =
      LocalProgressRepository(ProgressLocalDataSource(prefs));
  final avatarController = AvatarController(prefs);
  final rewardController = RewardController(prefs);

  runApp(EnglishTownApp(
    progressRepo: progressRepo,
    avatarController: avatarController,
    rewardController: rewardController,
  ));
}

class EnglishTownApp extends StatelessWidget {
  const EnglishTownApp({
    super.key,
    required this.progressRepo,
    required this.avatarController,
    required this.rewardController,
  });

  final ProgressRepository progressRepo;
  final AvatarController avatarController;
  final RewardController rewardController;

  @override
  Widget build(BuildContext context) {
    // Expose the repository so screens/cubits resolve it via context.read().
    return RepositoryProvider<ProgressRepository>.value(
      value: progressRepo,
      child: MaterialApp(
        title: 'SpeakX · English Town',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorSchemeSeed: const Color(0xFF4F46E5),
          useMaterial3: true,
        ),
        home: AppShell(
          avatarController: avatarController,
          rewardController: rewardController,
        ),
      ),
    );
  }
}
