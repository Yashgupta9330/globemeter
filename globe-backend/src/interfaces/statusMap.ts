export default interface IStatusMap {
  status: string;
  message: string;
  code: number;
  token?: string;
  user?: any;
  data?: any;
  completedQuiz?: boolean;
  correct?: boolean;
  infos?: any;
}