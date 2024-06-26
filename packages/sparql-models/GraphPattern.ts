import * as rdfjs from "@rdfjs/types";

type BlankNode = Omit<rdfjs.BlankNode, "equals">;
type Literal = Omit<rdfjs.Literal, "equals">;
type NamedNode = Omit<rdfjs.NamedNode, "equals">;
export type GraphPatternVariable = Omit<rdfjs.Variable, "equals">;

export type GraphPatternObject =
  | BlankNode
  | Literal
  | NamedNode
  | (GraphPatternVariable & {
      plainLiteral?: boolean;
    });

export type GraphPatternPredicate = NamedNode | GraphPatternVariable;

export type GraphPatternSubject = BlankNode | NamedNode | GraphPatternVariable;

export interface GraphPattern {
  object: GraphPatternObject;
  optional: boolean;
  predicate: GraphPatternPredicate;
  subGraphPatterns?: readonly GraphPattern[]; // For ?label ?license ...
  subject: GraphPatternSubject;
}
