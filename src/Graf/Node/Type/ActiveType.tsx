import React from 'react';
import { ParserField } from 'graphql-zeus';
import { GraphQLColors } from '@/editor/theme';
import { compileTypeOptions } from '@/GraphQL/Compile';
export const ActiveType: React.FC<Pick<ParserField, 'type'>> = ({ type }) => {
  let compiledType = compileTypeOptions({ type });
  return (
    <span
      className={`TypeColor-${type.name}`}
      style={{ color: type.name in GraphQLColors ? ((GraphQLColors as any)[type.name] as string) : '#fff' }}
    >
      {compiledType}
    </span>
  );
};
