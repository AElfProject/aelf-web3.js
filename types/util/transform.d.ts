import * as protobuf from '@aelfqueen/protobufjs';
interface IInTransformer {
  filter: (resolvedType: protobuf.Type) => boolean;
  transformer: (origin: string | Array<string>) => {
    value: string | Array<string>;
  };
}
interface IOutTransformer {
  filter: (resolvedType: protobuf.Type) => boolean;
  transformer: (origin: string | Array<string>) => string | Array<string>;
}

export function transform(
  inputType: protobuf.Type,
  origin: { [k: string]: any },
  transformers?: Array<IInTransformer | IOutTransformer>
): { [k: string]: any } | undefined | null;

export function transformMapToArray(
  inputType: protobuf.Type,
  origin?: { [k: string]: any }
): { [k: string]: any } | Array<{ [k: string]: any }> | undefined | null;
export function transformArrayToMap(
  inputType: protobuf.Type,
  origin?: { [k: string]: any } | Array<{ [k: string]: any }>
): { [k: string]: any } | undefined | null;
export const INPUT_TRANSFORMERS: IInTransformer;
export function encodeAddress(str: string): string;
export const OUTPUT_TRANSFORMERS: IOutTransformer[];
