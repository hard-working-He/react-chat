import { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Checkbox, Input, Button } from 'antd';
import { Link , useNavigate} from 'react-router-dom';
import { handleLogin } from './api';
import { tokenStorage } from '@/common/storage';
import { encrypt, decrypt } from '@/utils/encryption';

interface IUserInfo {
  id: number;
  avatar: string;
  username: string;
  name: string;
  phone: string;
  created_at: string;
  signature: string;
}
// 记住密码--主要就是将用户信息和token加密存储到本地
async function remenberUser(info: IUserInfo) {
  const userInfo = await encrypt(JSON.stringify(info));
  const authToken = await encrypt(tokenStorage.getItem());
  if (userInfo && authToken) {
    localStorage.setItem('userInfo', userInfo);
    localStorage.setItem('authToken', authToken);
  }
}
// 获取本地存储的用户信息
async function getUserInfo() {
  const userInfo = localStorage.getItem('userInfo');
  const authToken = localStorage.getItem('authToken');
  if (userInfo && authToken) {
    const info = JSON.parse(await decrypt(userInfo));
    const token = await decrypt(authToken);
    return { info, token };
  }
  return null;
}
// 随机生成一个字符串
const generateRandomString = () => {
  const randomValues = new Uint32Array(4);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (decimal) => decimal.toString(16)).join('');
};
const Login = () => {
  const navigate = useNavigate();
  const [isRemember, setIsRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status1, setStatus1] = useState<'' | 'error' | 'warning' | undefined>();
  const [status2, setStatus2] = useState<'' | 'error' | 'warning' | undefined>();
  const handleUserNameChange = (e: { target: { value: string } }) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e: { target: { value: string } }) => {
    setPassword(e.target.value);
  };


  // 判断本地是否有用户信息，有则无需向后台发起请求，直接登录
  // 无则向后台发起请求，同时判断是否勾选了记住密码，勾选了则将用户信息存储到本地
  const handleSubmit = () => {
    // 前端数据校验
    getUserInfo().then((res) => {
      if (res) {
        tokenStorage.setItem(res.token);
        navigate('/');
        return;
      } else {
        // 前端数据校验
        if (!username) {
          setStatus1('error');
        }
      if (!password) {
          setStatus2('error');
        }
        if (!username || !password || !confirm) {
          message.error('请输入用户名或密码！', 1.5);
          setTimeout(() => {
            setStatus1(undefined);
            setStatus2(undefined);
          }, 1500);
          return;
        }
        setLoading(true);
        // 调用登录接口
        const param = {
          username,
          password,
        };
        handleLogin(param)
          .then((res) => {
            if (res.code === 200) {
              message.success('登录成功！', 1.5);
              setLoading(false);
              tokenStorage.setItem(res.data.token);
              // 判断是否勾选了记住密码
              if (isRemember) {
                remenberUser(res.data.info);
              }
              navigate('/');
            } else {
              message.error(res.message, 1.5);
              setLoading(false);
            }
          })
          .catch(() => {
            message.error('登录失败，请稍后再试！', 1.5);
            setLoading(false);
          });
      }
    });
  };
  // 记住密码
  // 记住密码--取消勾选则清除本地存储的用户信息
  const handleRemember = () => {
    const newIsRemember = !isRemember;
    setIsRemember(newIsRemember);
    localStorage.setItem('isRemember', JSON.stringify(newIsRemember));
    if (newIsRemember === false) {
      setIsRemember(false);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('authToken');
    }
  };
   // 初始化时判断本地是否有记住密码，有则将信息填充到输入框中，同时将记住密码勾选上
  useEffect(() => {
   getUserInfo().then((res) => {
      if (res) {
        setUsername(res.info.username);
        setPassword(generateRandomString());
        setIsRemember(true);
      } else {
        setIsRemember(false);
      }
    });
  }, []);
  // 忘记密码
  const handleForget = () => {
    message.info('请联系系统开发者处理');
  };
  return (
    <>
      <div className={styles.bgContainer}>
        <form action="">
          <div className={styles.logintext}>
            <h2>Webchat</h2>
          </div>
          <div className={styles.loginoptions}>
            <Input
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={handleUserNameChange}
              maxLength={255}
              status={status1}
            />
            <Input
              type="password"
              placeholder="请输入密码"
               value={password}
              onChange={handlePasswordChange}
              maxLength={255}
              status={status2}
            />
            <div className={styles.login_tools}>
              <div className={styles.remenberTool}>
                <Checkbox onChange={handleRemember} checked={isRemember}>
                  记住密码
                </Checkbox>
              </div>
              <div className={styles.forgetpasTool} onClick={handleForget}>
                忘记密码？
              </div>
            </div>
             <Button type="primary" className={styles.login_button} onClick={handleSubmit} loading={loading}>
              登录
            </Button>
            <span className={styles.login_link}>
              <Link to="/register">立即注册</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;