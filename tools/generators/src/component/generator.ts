import { formatFiles, generateFiles, names, type Tree } from '@nx/devkit';
import * as path from 'node:path';
import type { ComponentGeneratorSchema } from './schema';

const COMPONENTS_DIR = 'packages/web-components/src/components';
// Styles live in a Panda recipe in the styles package, so plain-HTML pages can use them too
const RECIPES_DIR = 'packages/styles/src/recipes';
const RECIPES_INDEX = `${RECIPES_DIR}/index.ts`;

export async function componentGenerator(tree: Tree, options: ComponentGeneratorSchema) {
  const tag = `lds-${options.name}`;
  const target = path.posix.join(COMPONENTS_DIR, tag);
  const recipeFile = path.posix.join(RECIPES_DIR, `${options.name}.ts`);
  if (tree.exists(target)) {
    throw new Error(`${tag} already exists at ${target}`);
  }
  if (tree.exists(recipeFile)) {
    throw new Error(`A recipe called "${options.name}" already exists at ${recipeFile}`);
  }

  const n = names(tag); // className: LdsCard, fileName: lds-card, ...
  const recipe = names(options.name); // propertyName: card / iconButton, className: Card / IconButton
  const substitutions = {
    tag,
    name: options.name,
    className: n.className,
    recipeName: recipe.propertyName,
    // The variant type Panda generates for the recipe, e.g. IconButtonVariant
    recipeTypeName: `${recipe.className}Variant`,
    title: recipe.className.replace(/([a-z])([A-Z])/g, '$1 $2'),
    description: options.description ?? 'TODO: describe what this component is for.',
    storyGroup: options.storyGroup ?? 'Core',
    template: '',
  };

  generateFiles(
    tree,
    path.join(import.meta.dirname, 'files', 'component'),
    COMPONENTS_DIR,
    substitutions,
  );
  generateFiles(
    tree,
    path.join(import.meta.dirname, 'files', 'recipe'),
    RECIPES_DIR,
    substitutions,
  );
  registerRecipe(tree, recipe.propertyName, options.name);

  await formatFiles(tree);

  return () => {
    console.log(
      `\nCreated ${tag} and its recipe (${recipeFile}). Next:\n  pnpm nx build web-components   # builds the styles package first\n  pnpm nx test storybook\n  pnpm nx test web-components   # first run writes the screenshot references\n`,
    );
  };
}

/** Adds `export { card } from './card';` to the recipes index, keeping it sorted. */
function registerRecipe(tree: Tree, recipeName: string, fileName: string) {
  const current = tree.read(RECIPES_INDEX, 'utf-8') ?? '';
  const lines = current.split('\n');
  const exportLines = lines.filter((line) => line.startsWith('export '));
  const otherLines = lines.filter((line) => line.trim() !== '' && !line.startsWith('export '));
  exportLines.push(`export { ${recipeName} } from './${fileName}';`);
  exportLines.sort();
  tree.write(RECIPES_INDEX, [...otherLines, ...exportLines, ''].join('\n'));
}

export default componentGenerator;
