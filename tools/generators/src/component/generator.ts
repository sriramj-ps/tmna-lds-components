import { formatFiles, generateFiles, names, type Tree } from '@nx/devkit';
import * as path from 'node:path';
import type { ComponentGeneratorSchema } from './schema';

const COMPONENTS_DIR = 'packages/web-components/src/components';

export async function componentGenerator(tree: Tree, options: ComponentGeneratorSchema) {
  const tag = `lds-${options.name}`;
  const target = path.posix.join(COMPONENTS_DIR, tag);
  if (tree.exists(target)) {
    throw new Error(`${tag} already exists at ${target}`);
  }

  const n = names(tag); // className: LdsCard, fileName: lds-card, ...
  generateFiles(tree, path.join(import.meta.dirname, 'files'), COMPONENTS_DIR, {
    tag,
    className: n.className,
    title: names(options.name).className.replace(/([a-z])([A-Z])/g, '$1 $2'),
    description: options.description ?? 'TODO: describe what this component is for.',
    storyGroup: options.storyGroup ?? 'Core',
    template: '',
  });

  await formatFiles(tree);

  return () => {
    console.log(
      `\nCreated ${tag}. Next:\n  pnpm nx build web-components\n  pnpm nx test storybook\n  pnpm nx test web-components   # first run writes the screenshot references\n`,
    );
  };
}

export default componentGenerator;
