import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../cubit/progress_cubit.dart';

/// Progress screen — the vertical-slice proof for the SpeakX migration.
/// UI is intentionally close to the prototype's ProgressScreen; restyle with
/// SpeakX's theme/design system once wired into the app.
class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key, this.totalSubtopics = 100});

  final int totalSubtopics;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (ctx) => ProgressCubit(ctx.read())..load(),
      child: Scaffold(
        appBar: AppBar(title: const Text('My Progress')),
        body: BlocBuilder<ProgressCubit, ProgressState>(
          builder: (context, state) {
            switch (state.status) {
              case ProgressStatus.loading:
              case ProgressStatus.initial:
                return const Center(child: CircularProgressIndicator());
              case ProgressStatus.error:
                return _ErrorView(
                  message: state.error ?? 'Something went wrong',
                  onRetry: () => context.read<ProgressCubit>().load(),
                );
              case ProgressStatus.ready:
                final p = state.progress;
                final pct = (p.completedCount / totalSubtopics).clamp(0.0, 1.0);
                return Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Coins: ${p.coins}',
                          style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 16),
                      Text('Current lesson: ${p.currentId}'),
                      const SizedBox(height: 8),
                      Text(
                          '${p.completedCount} / $totalSubtopics lessons complete'),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(value: pct),
                      const Spacer(),
                      FilledButton(
                        onPressed: () => context
                            .read<ProgressCubit>()
                            .completeCurrentLesson(),
                        child: const Text('Complete current lesson'),
                      ),
                    ],
                  ),
                );
            }
          },
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(message),
          const SizedBox(height: 12),
          OutlinedButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}
