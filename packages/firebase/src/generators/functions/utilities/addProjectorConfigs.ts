import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../generator';

export default function addProjectConfigs(
  tree: Tree,
  normalizedOptions: NormalizedSchema
) {
  // As firebase allows you to organize your projects in codebases, we need to
  // append the codebase to the command, so that we can deploy the correct
  // functions only.
  // Docs: https://firebase.google.com/docs/functions/beta/organize-functions
  const { codebase } = normalizedOptions;
  const appendCodebase = codebase !== 'default' ? `:${codebase}` : '';

  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      lint: {
        executor: '@nrwl/linter:eslint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: [`${normalizedOptions.projectRoot}/**/*.ts`],
          fix: true,
        },
      },
      build: {
        executor: '@nrwl/esbuild:esbuild',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'production',
        options: {
          main: `${normalizedOptions.projectDirectory}/src/index.ts`,
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          outputFileName: 'index.js',
          project: `${normalizedOptions.projectRoot}/package.json`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.json`,
          assets: [],
          platform: 'node',
          dependenciesFieldType: 'dependencies',
          // do not bundle npm dependencies
          thirdParty: false,
        },
        configurations: {
          development: {
            minify: false,
          },
          production: {
            minify: true,
          },
        },
      },
      serve: {
        command: `firebase emulators:start --only functions${appendCodebase}`,
      },
      deploy: {
        command: `firebase deploy --only functions${appendCodebase}`,
      },
    },
    tags: normalizedOptions.parsedTags,
  });
}
