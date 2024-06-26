import { Label } from "./Label.js";
import { Model } from "./Model.js";
import { BlankNode, NamedNode } from "@rdfjs/types";

/**
 * Common interface between Concept and ConceptScheme.
 */
export interface LabeledModel extends Model {
  /**
   * Alternate labels, equivalent to skos:altLabel.
   */
  readonly altLabels: readonly Label[];

  readonly displayLabel: string;

  readonly identifier: BlankNode | NamedNode;

  /**
   * Hidden labels, equivalent to skos:hiddenLabel.
   */
  readonly hiddenLabels: readonly Label[];

  /**
   * Preferred labels, equivalent to skos:prefLabel.
   */
  readonly prefLabels: readonly Label[];
}
