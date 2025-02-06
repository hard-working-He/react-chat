import styles from './index.module.less'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Tooltip, Modal, Button, message, Input,App } from 'antd'
import { wsBaseURL } from '@/assets/links/baseURL';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import ChangePwdModal from '@/components/ChangePwdModal'
import ChangeInfoModal from '@/components/ChangeInfoModal'
import ChatList from './ChatList'
import AddressBook from './AddressBook'
import { iconList } from './variable'
import { menuIconList } from '@/assets/icons'
import { IUserInfo } from '@/components/ChangePerInfoModal/type';
import { handleLogout } from '@/utils/logout';
import { userStorage, clearSessionStorage } from '@/common/storage'
import { IFriendInfo } from './AddressBook/api/type';

type AddressBookRefType = {
  refreshFriendList: () => void;
};
type ChatListRefType = {
  refreshChatList: () => void;
};

const Container = () => {
  const { message } = App.useApp();
  const { username, name, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
  const [currentIcon, setCurrentIcon] = useState<string>('icon-message')
  const navigate = useNavigate();
  const [openAddModal, setAddModal] = useState(false)
  const [openCreateModal, setCreateModal] = useState(false)
  const [openForgetModal, setForgetModal] = useState(false)
  const [openInfoModal, setInfoModal] = useState(false)
const socket = useRef<WebSocket | null>(null); // websocket实例
  const addressBookRef = useRef<AddressBookRefType>(null); // 通讯录组件实例
  const chatListRef = useRef<ChatListRefType>(null); // 聊天列表组件实例
 const [initSelectedChat, setInitSelectedChat] = useState<IFriendInfo | null>(null); // 初始化选中的聊天对象(只有从通讯录页面进入聊天页面时才会有值)

    // 控制修改密码的弹窗显隐
  const handleForget = () => {
    setForgetModal(!openForgetModal);
  };
  // 控制修改信息的弹窗显隐
  const handleInfo = () => {
    setInfoModal(!openInfoModal);
  };
  // 退出登录
  const confirmLogout = () => {
    handleLogout(JSON.parse(userStorage.getItem() || '{}') as IUserInfo)
      .then((res) => {
        if (res.code === 200) {
          clearSessionStorage();
          message.success('退出成功', 1.5);
          // 关闭websocket连接
          if (socket.current !== null) {
            socket.current.close();
            socket.current = null;
          }
          navigate('/login');
        } else {
          message.error('退出失败,请重试', 1.5);
        }
      })
      .catch(() => {
        message.error('退出失败,请重试', 1.5);
      });
  };
  // 点击头像用户信息弹窗
  const infoContent = (
    <div className={styles.infoContent}>
      <div className={styles.infoContainer}>
        <div className={styles.avatar}>
          <img src={avatar} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.phone}>手机号：{phone}</div>
          <div className={styles.signature}>{signature === '' ? '暂无个性签名' : signature}</div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <Button
          size="small"
          onClick={() => {
            handleForget();
          }}
        >
          修改密码
        </Button>
        <Button
          size="small"
          onClick={() => {
            handleInfo();
          }}
        >
          修改信息
        </Button>
      </div>
    </div>
  );
  // 进入到主页面时建立一个websocket连接
  const initSocket = () => {
    const newSocket = new WebSocket(`${wsBaseURL}/auth/user_channel?username=${username}`);
    console.log('newSocket',newSocket)
    newSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.name) {
        case 'friendList':
          //重新加载好友列表
          addressBookRef.current?.refreshFriendList();
          break;
        case 'chatList':
          //重新加载消息列表
          //chatListRef.current?.refreshChatList();
          break;
        //音视频--to do
        case 'audio':
          console.log('音视频');
          break;
        //音视频--to do
        case 'video':
          console.log('音视频');
          break;
        //音视频响应--to do
        case 'peer':
          console.log('音视频响应');
          break;
        //拒绝
        case 'reject':
          if (data.message) {
            App.useApp().message.error(data.message, 1.5);
          } else {
            socket.current?.send(JSON.stringify({ name: 'reject' }));
          }
          break;
      }
    };
     socket.current = newSocket;
  };
  useEffect(() => {
    initSocket();
  }, []);

// 在通讯录页面选择一个好友发送信息时跳转到聊天页面
  const handleChooseFriend = (item: IFriendInfo) => {
    setCurrentIcon('icon-message');
    setInitSelectedChat(item);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <Tooltip placement="bottomLeft" title={infoContent} arrow={false}>
            <div className={styles.avatar}>
              <img src={avatar} alt="" />
            </div>
          </Tooltip>
          <div className={styles.iconList}>
            <ul className={styles.topIcons}>
              {iconList.slice(0, 5).map((item) => {
                return (
                  <Tooltip
                    key={item.text}
                    placement="bottomLeft"
                    title={item.text}
                    arrow={false}
                  >
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        if (item.text == '聊天' || item.text == '通讯录') {
                          setCurrentIcon(item.icon)
                        }
                      }}
                      style={{
                        color:
                          currentIcon === item.icon ? '#07c160' : '#979797',
                      }}
                    ></li>
                  </Tooltip>
                )
              })}
            </ul>
            <ul className={styles.bottomIcons}>
              {iconList.slice(5, 8).map((item) => {
                return (
                  <Tooltip
                    key={item.text}
                    placement="bottomLeft"
                    title={item.text}
                    arrow={false}
                  >
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        setCurrentIcon(item.text)
                      }}
                      style={{
                        color:
                          currentIcon === item.text ? '#07c160' : '#979797',
                      }}
                    ></li>
                  </Tooltip>
                )
              })}
            </ul>
          </div>
        </div>
        {/* <div className={styles.middleContainer}>
        </div> */}
        <div className={styles.rightContainer}>
          {currentIcon === 'icon-message' ? (
            <ChatList initSelectedChat={initSelectedChat} ref={chatListRef} />
          ) : (
            <AddressBook handleChooseFriend={handleChooseFriend} ref={addressBookRef} />
          )}
        </div>
      </div>
      {
        // 修改信息弹窗
        openInfoModal && <ChangeInfoModal />
      }
    </>
  )
}
export default Container
