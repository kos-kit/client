import { LanguageTagSet } from "../../../src/models/LanguageTagSet";
import {
  GraphPatternObject,
  GraphPatternSubject,
  graphPatternsToConstructQuery,
} from "../../../src/models/sparql";
import { skos } from "../../../src/vocabularies";
import { Concept } from "../../../src/models/sparql/Concept";

describe("graphPatternsToConstructQuery", () => {
  const subject: GraphPatternSubject = {
    termType: "NamedNode",
    value: "http://example.com/concept",
  };
  const predicate = skos.prefLabel;
  const object: GraphPatternObject = {
    termType: "Variable",
    value: "prefLabel",
  };

  it("should translate a single required pattern", () => {
    expect(
      graphPatternsToConstructQuery([
        {
          subject,
          predicate,
          object,
          optional: false,
        },
      ]),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  <${subject.value}> <${predicate.value}> ?${object.value} .
}`);
  });

  it("should translate a single optional pattern", () => {
    expect(
      graphPatternsToConstructQuery([
        {
          subject,
          predicate,
          object,
          optional: true,
        },
      ]),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  OPTIONAL {
    <${subject.value}> <${predicate.value}> ?${object.value} .
  }
}`);
  });

  it("should translate a filter", () => {
    expect(
      graphPatternsToConstructQuery(
        [
          {
            subject,
            predicate,
            object: { ...object, plainLiteral: true },
            optional: false,
          },
        ],
        { includeLanguageTags: new LanguageTagSet("en", "") },
      ),
    ).toStrictEqual(`\
CONSTRUCT {
  <${subject.value}> <${predicate.value}> ?${object.value} .
} WHERE {
  <${subject.value}> <${predicate.value}> ?${object.value} .
  FILTER (!BOUND(?${object.value}) || LANG(?${object.value}) = "en" || LANG(?${object.value}) = "" )
}`);
  });

  it("should translate a conceptByIdentifier query", () => {
    const subject: GraphPatternSubject = {
      termType: "NamedNode",
      value: "http://example.com/concept",
    };
    const actual = graphPatternsToConstructQuery(
      Concept.propertyGraphPatterns(subject),
    );
    // console.log("\n", actual);
    expect(actual).not.toHaveLength(0);
  });
});
