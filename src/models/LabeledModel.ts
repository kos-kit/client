import { Label } from "./Label";
import { LanguageTag } from "./LanguageTag";
import { Model } from "./Model";

export interface LabeledModel extends Model {
  altLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]>;
  hiddenLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]>;
  prefLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]>;
}