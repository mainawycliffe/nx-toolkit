import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../generator';

export default function addProjectConfigs(
  tree: Tree,
  normalizedOptions: NormalizedSchema
) {
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
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
      // todo: will circle back to this later
      // serve: {
      //   executor: '@nx-toolkits/firebase:serve',
      // },
      build: {
        executor: '@nrwl/js:tsc',
        dependsOn: ['lint'],
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.json`,
          main: `${normalizedOptions.projectDirectory}/src/index.ts`,
          buildableProjectDepsInPackageJsonType: 'dependencies', // use dependencies instead of peerDependencies
          clean: true, // clean the output directory before building
          updateBuildableProjectDepsInPackageJson: true, // update the package.json with the dependencies of the buildable project
        },
      },
      deploy: {
        executor: '@nx-toolkits/firebase:deploy',
        dependsOn: ['build'],
      },
    },
    tags: normalizedOptions.parsedTags,
  });
}
