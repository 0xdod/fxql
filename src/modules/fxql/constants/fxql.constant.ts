// Regex to match the format of the statement: USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}
export const FXQLStatementRegex =
  /(?<pair>[A-Z]{3}-[A-Z]{3})\s*\{\s*\n\s*BUY\s*(?<buy>\d+(\.\d+)?)\s*\n\s*SELL\s*(?<sell>\d+(\.\d+)?)\s*\n\s*CAP\s*(?<cap>\d+)\s*\n\}(\n)*/g;

export const SampleFXQLStatement =
  'USD-GBP {\n BUY 100\n SELL 200\n CAP 93800\n}';
