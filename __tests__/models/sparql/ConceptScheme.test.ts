import { testKos } from "./testKos";
import { DataFactory } from "n3";
import { behavesLikeUnescoThesaurusConceptScheme } from "../behavesLikeUnescoThesaurusConceptScheme";

describe("SparqlConceptScheme", () => {
  behavesLikeUnescoThesaurusConceptScheme(() =>
    testKos.conceptSchemeByIdentifier(
      DataFactory.namedNode("http://vocabularies.unesco.org/thesaurus"),
    ),
  );
});