export const FilterableFields: string[] = ["searchTerm", "id"];

export const SearchableFields: string[] = ["name", "email", "role"];

export const RelationalFields: string[] = ["code"];

export const RelationalFieldsMapper: {
  [key: string]: string;
} = {
  id: "user",
};
