import { post } from '@/lib/request'

/**
 * 未读通知总数
 * @param params account_id number
 * @param params signature string
 * @returns 
 */
export const getUnreadTotal = async (params) => {
  return await post('/notice/unread-total', params)
};
