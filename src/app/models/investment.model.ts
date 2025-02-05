export interface Investment {
  id: number;
  category: string;
  amount: number;
  date: string;
  growth: number;
  gain: number;
  expanded?: boolean;  //Expanded property
}