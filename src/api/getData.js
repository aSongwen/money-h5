import fetch from '@/config/fetch'

/**
 * 登陆
 */
export const login = data => fetch('/ums/pub/user/login_by_mobile_H5', data, 'POST');
/**
 *验证邀请码
 */
export const realCheckCode = data => fetch('/ums/pub/user/check_promoter_code', data, 'POST');
/**
 * 注册获取手机验证码
 */
export const sendMobileMessage = data => fetch('/ums/pub/user/send_mobile_message', data, 'POST');
/**
 * 获取手机验证码时校验图片验证码
 */
export const sendMobileMessageCode = data => fetch('/ums/pub/user/send_mobile_message_code',data,'POST');
/**
 * 判断手机号是否可用
 */
export const checkMobile = data => fetch('/ums/pub/user/check_mobile', data, 'POST');
/**
 *推手注册
 */
export const registerPromoter = data => fetch('/ums/pub/user/register_promoter', data, 'POST');
/**
 *绑定订单淘口令
 */
export const getTaoToken = data => fetch('/pbs/api/promoter/get_tao_token', data, 'POST');
/**
 * 提交订单号绑定淘宝
 */
export const pushOrderAudit = data => fetch('/mbs/api/order/pushOrderAudit', data, 'POST');
/**
 * 查询是否拉取banner图
 */
export const getBannerFlag = data => fetch('/pbs/api/banner/get_banner_flag', data, 'POST');
/**
 * 查询banner图
 */
export const getBanner = data => fetch('/pbs/api/banner/getBanner', data, 'POST');
/**
 * 通过文件id获取地址
 */
export const getFileUrl = data => fetch('/file/pub/getFileUrl', data, 'POST');
/**
 * 获取背景水印图
 */
export const getBgmarkUrl = data => fetch('/pbs/api/promoter/get_bgmark_url', data, 'POST');
/**
 * 查询系统公告
 */
export const querySystemMessage = data => fetch('/ums/api/message/query_system_message', data, 'POST');
/**
 * 查询用户详情
 */
export const loadPromoterInfo = data => fetch('/pbs/api/promoter/load_promoter_info', data, 'POST');
/**
 * 查询用户财务账号
 */
export const getFinanceAccount = data => fetch('/pbs/api/finance/get_finance_account', data, 'POST');
/**
 * 查询用户接单量
 */
export const countPromoterTasks = data => fetch('/pbs/api/executeTask/countPromoterExecuteTasks', data, 'POST');
/**
 * 上报位置信息
 */
export const saveGpsDay = data => fetch('/pbs/api/gps_history/save_day', data, 'POST');
/**
 * 查询推手财务流水
 */
export const queryPromoterFinance = data => fetch('/pbs/api/finance/query_promoter_finance',data,'POST');
/**
 * 刷新token
 */
export const refreshToken = data => fetch('/ums/pub/user/refresh_token', data, 'POST');
/**
 * 接单
 */
export const grabTask = data => fetch('/pbs/api/promote_task/grab_task', data, 'POST');
/**
 * 查询系统公告
 */
export const getSystemMessage = data => fetch('/ums/api/message/get_system_message', data, 'POST');
/**
 * 获取推手抢单配置信息
 */
export const getPromoterConfig = data => fetch('/pbs/api/promoter/get_promoter_config',data,'POST');
/**
 * 保存抢单配置信息
 */
export const savePromoterConfig = data => fetch('/pbs/api/promoter/save_promoter_config',data,'POST');
/**
 * 统计推手可提现佣金金额
 */
export const countEnableWithdrawCoin = data => fetch('/pbs/api/finance/count_enable_withdraw_coin',data,'POST');
/**
 * 获取设定参数
 */
export const getMiniappsNotice = data => fetch('/pbs/api/miniAppNotice/get_miniapps_notice',data,'POST');
/**
 * 获取转账手续费及最小提现额度
 */
export const getWithdrawFee = data => fetch('/pbs/api/finance/get_withdraw_fee',data,'POST');
/**
 * 通过验证码绑定微信公众号
 */
export const promoterBindWechat = data => fetch('/pbs/api/promoter/promoter_wechat_bind',data,'POST');
/**
 * 获取推手所在公众号名称
 */
export const getWechatName = data => fetch('/pbs/api/promoter/get_promoter_wechat_name',data,'POST');
/**
 *
 */
export const getPromoteTasksCount = data => fetch('/pbs/api/promote_task/get_promote_tasks_count',data,'POST');
/**
 *
 */
export const getPromoteTasks = data => fetch('/pbs/api/promote_task/get_promote_tasks',data,'POST');
/**
 *查询推手提现记录
 */
export const queryPromoterFinanceCert = data => fetch('/pbs/api/finance/query_promoter_finance_cert',data,'POST');
/**
 *查询推手提现记录
 */
export const getProp = data => fetch('/ums/api/prop/get_prop',data,'POST');
/**
 *查询任务详情
 */
export const getTaskDetail = data => fetch('/pbs/api/promote_task/get_task_detail',data,'POST');
/**
 *提交任务
 */
export const submitResult = data => fetch('/pbs/api/promote_task/submit_result',data,'POST');
/**
 * 核对淘口令
 */
export const linksCheck = data => fetch('/pbs/api/promote_task/taobao_links_check',data,'POST');
/**
 * 推荐人统计
 */
export const promoterCodeCount = data => fetch('/pbs/api/promoter/promoter_code_count',data,'POST');
/**
 *查询用户消息
 */
export const queryUserMessage = data => fetch('/ums/api/message/query_user_message',data,'POST');
/**
 *查看用户消息详情
 */
export const getUserMessage = data => fetch('/ums/api/message/get_user_message',data,'POST');
/**
 * 修改手机号
 */
export const changeUserMobile = data => fetch('/ums/api/user/change_user_mobile',data,'POST');
/**
 *分页查询银行信息
 */
export const queryBank = data => fetch('/oms/api/bank/query_bank',data,'POST');
/**
 *修改推手银行卡
 */
export const changeBankNumber = data => fetch('/pbs/api/promoter/change_bank_number',data,'POST');
/**
 *修改用户QQ
 */
export const changeUserQQ = data => fetch('/ums/api/user/change_user_qq',data,'POST');
/**
 *累计推荐金额
 */
export const getRewardMoney = data => fetch('/pbs/api/finance/get_reward_money',data,'POST');
/**
 *最新邀请码
 */
export const queryInviteCode = data => fetch('/oms/api/invite_code/query_invite_code',data,'POST');
/**
 *我推荐的人
 */
export const myRecommends = data => fetch('/pbs/api/promoter/my_recommends',data,'POST');
/**
 *移除我推荐的人
 */
export const deleteRecommends = data => fetch('/pbs/api/promoter/delete_my_recommends',data,'POST');
/**
 *设置备注
 */
export const updatePromoterInfo = data => fetch('/oms/api/promoter/update_promoter_info',data,'POST');
/**
 *查询历史邀请码
 */
export const queryPromoterCode = data => fetch('/pbs/api/promoter/query_promoter_code',data,'POST');
/**
 *修改用户微信
 */
export const changeUserWechat = data => fetch('/ums/api/user/change_user_wechat',data,'POST');
/**
 * 查询分佣总数
 */
export const countInvateTaskData = data => fetch('/pbs/api/promoter/count_referee_invate_task_data',data,'POST');
/**
 * 查询分佣列表
 */
export const invateTaskList = data => fetch('/pbs/api/promoter/count_referee_invate_task',data,'POST');
/**
 * 生成验证码
 */
export const createPromoterCode = data => fetch('/pbs/api/promoter/create_promoter_code',data,'POST');
/**
 *分页查询执行任务
 */
export const queryMini = data => fetch('/pbs/api/executeTask/queryMini',data,'POST');
/**
 *微信提现
 */
export const withdrawWechatPublic = data => fetch('/pbs/api/promoter/withdraw_wechat_public',data,'POST');
/**
 *判断是否绑定微信
 */
export const getBindWechatStatus = data => fetch('/pbs/api/promoter/get_bind_wechat_status',data,'POST');
/**
 *解析身份证信息
 */
export const getOcrIdCard = data => fetch('/pbs/api/promoter/get_ocr_id_card',data,'POST');
/**
 *修改推手身份证信息
 */
export const save = data => fetch('/pbs/api/promoter/change_id_card_info',data,'POST');
/**
 *
 */
export const promoterWithdraw = data => fetch('/pbs/api/finance/promoter_withdraw',data,'POST');
