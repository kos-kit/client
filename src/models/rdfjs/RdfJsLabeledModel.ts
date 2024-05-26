import { NamedNode } from "@rdfjs/types";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { RdfJsModel } from "./RdfJsModel";
import { LabeledModel } from "../LabeledModel";
import { LanguageTag } from "../LanguageTag";
import { Label } from "../Label";
import { skos, skosxl } from "../../vocabularies";
import { LiteralLabel } from "../LiteralLabel";
import { RdfJsLabel } from "./RdfJsLabel";

export abstract class RdfJsLabeledModel
  extends RdfJsModel
  implements LabeledModel
{
  altLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTag: kwds?.languageTag,
          skosPredicate: skos.altLabel,
          skosXlPredicate: skosxl.altLabel,
        }),
      ]),
    );
  }

  hiddenLabels(kwds?: {
    languageTag?: LanguageTag;
  }): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTag: kwds?.languageTag,
          skosPredicate: skos.hiddenLabel,
          skosXlPredicate: skosxl.hiddenLabel,
        }),
      ]),
    );
  }

  private *labels({
    languageTag,
    skosPredicate,
    skosXlPredicate,
  }: {
    languageTag?: LanguageTag;
    skosPredicate: NamedNode;
    skosXlPredicate: NamedNode;
  }): Iterable<Label> {
    yield* this.filterAndMapObjects(skosPredicate, (term) =>
      term.termType === "Literal" &&
      (!languageTag || term.language === languageTag)
        ? new LiteralLabel(term)
        : null,
    );

    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    yield* this.filterAndMapObjects(skosXlPredicate, (term) => {
      const labelIdentifier = mapTermToIdentifier(term);
      if (labelIdentifier === null) {
        return null;
      }

      for (const literalFormQuad of this.dataset.match(
        term,
        skosxl.literalForm,
        null,
        null,
      )) {
        if (literalFormQuad.object.termType !== "Literal") {
          continue;
        }

        if (languageTag && literalFormQuad.object.language !== languageTag) {
          continue;
        }

        return new RdfJsLabel({
          dataset: this.dataset,
          identifier: labelIdentifier,
          literalForm: literalFormQuad.object,
        });
      }

      return null;
    });
  }

  prefLabels(kwds?: { languageTag?: LanguageTag }): Promise<readonly Label[]> {
    return new Promise((resolve) =>
      resolve([
        ...this.labels({
          languageTag: kwds?.languageTag,
          skosPredicate: skos.prefLabel,
          skosXlPredicate: skosxl.prefLabel,
        }),
      ]),
    );
  }
}