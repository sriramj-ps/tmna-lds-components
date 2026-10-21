import { defineRecipe as pandaDefineRecipe } from '@pandacss/dev';
import type { RecipeDefinition, RecipeVariantRecord } from '../styled-system/types';

type PandaRecipeConfig = Parameters<typeof pandaDefineRecipe>[0];

/**
 * Panda's `defineRecipe`, but type-checked against the styles generated from OUR tokens
 * (`strictTokens: true`). Panda's own `defineRecipe` accepts any CSS value, so a raw
 * `paddingInline: '13px'` would ship silently; with this wrapper it fails `nx typecheck styles`.
 *
 * Escape hatch for a one-off raw value the system has no token for: `'[13px]'` (reviewers
 * should push back, and the value belongs in the styling repo as a token instead).
 */
export function defineRecipe<T extends RecipeVariantRecord>(
  config: RecipeDefinition<T> & Pick<PandaRecipeConfig, 'className' | 'description' | 'jsx'>,
): PandaRecipeConfig {
  return pandaDefineRecipe(config as unknown as PandaRecipeConfig);
}
