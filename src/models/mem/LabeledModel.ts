import { NamedNode } from "@rdfjs/types";
import { mapTermToIdentifier } from "./mapTermToIdentifier";
import { Model } from "./Model";
import { LabeledModel as ILabeledModel } from "../LabeledModel";
import { LanguageTag } from "../LanguageTag";
import { skos, skosxl } from "../../vocabularies";
import { LiteralLabel } from "../LiteralLabel";
import { Label } from "./Label";
import { Label as ILabel } from "../Label";
import { identifierToString } from "../../utilities";

export abstract class LabeledModel extends Model implements ILabeledModel {
  get altLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.altLabel,
      skosXlPredicate: skosxl.altLabel,
    });
  }

  get displayLabel(): string {
    const prefLabels = this.prefLabels;
    if (prefLabels.length > 0) {
      for (const languageTag of this.includeLanguageTags) {
        for (const prefLabel of prefLabels) {
          if (prefLabel.literalForm.language === languageTag) {
            return prefLabel.literalForm.value;
          }
        }
      }
    }

    return identifierToString(this.identifier);
  }

  get hiddenLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.hiddenLabel,
      skosXlPredicate: skosxl.hiddenLabel,
    });
  }

  private labels({
    skosPredicate,
    skosXlPredicate,
  }: {
    includeLanguageTags?: Set<LanguageTag>;
    skosPredicate: NamedNode;
    skosXlPredicate: NamedNode;
  }): readonly ILabel[] {
    const labels: ILabel[] = [];

    for (const quad of this.dataset.match(
      this.identifier,
      skosPredicate,
      null,
    )) {
      if (
        quad.object.termType === "Literal" &&
        (this.includeLanguageTags.size === 0 ||
          this.includeLanguageTags.has(quad.object.language))
      ) {
        labels.push(new LiteralLabel(quad.object));
      }
    }

    // Any resource in the range of a skosxl: label predicate is considered a skosxl:Label
    for (const quad of this.dataset.match(
      this.identifier,
      skosXlPredicate,
      null,
    )) {
      const labelIdentifier = mapTermToIdentifier(quad.object);
      if (labelIdentifier === null) {
        continue;
      }
      for (const literalFormQuad of this.dataset.match(
        labelIdentifier,
        skosxl.literalForm,
        null,
        null,
      )) {
        if (literalFormQuad.object.termType !== "Literal") {
          continue;
        }

        if (
          this.includeLanguageTags.size > 0 &&
          !this.includeLanguageTags.has(literalFormQuad.object.language)
        ) {
          continue;
        }

        labels.push(
          new Label({
            dataset: this.dataset,
            identifier: labelIdentifier,
            includeLanguageTags: this.includeLanguageTags,
            literalForm: literalFormQuad.object,
          }),
        );
      }
    }

    return labels;
  }

  get prefLabels(): readonly ILabel[] {
    return this.labels({
      skosPredicate: skos.prefLabel,
      skosXlPredicate: skosxl.prefLabel,
    });
  }
}
