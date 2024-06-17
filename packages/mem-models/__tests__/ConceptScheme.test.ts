import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../../models/__tests__/behavesLikeUnescoThesaurusConceptScheme";
import { testKosFactory } from "./testKosFactory";
import { describe } from "vitest";

describe("mem.ConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme((includeLanguageTag) =>
    testKosFactory(includeLanguageTag).conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});
