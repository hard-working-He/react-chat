import styles from './index.module.less';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Modal, Button, message, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddFriendOrGroupModal from './AddFriendOrGroupModal';
import CreateGroupModal from './CreateGroupModal';
import ChatList from './ChatList';
import AddressBook from './AddressBook';
import { iconList } from './variable';
import { userStorage, clearSessionStorage } from '@/common/storage';

const Container = () => {
  const { username, avatar, phone, signature } = JSON.parse(userStorage.getItem() || '{}');
  const [currentIcon, setCurrentIcon] = useState<string>('icon-message');
  const [openAddModal, setAddModal] = useState(false);
	const [openCreateModal, setCreateModal] = useState(false);
  const handleAdd = () => {
    setAddModal(!openAddModal);
  };
  // 控制创建群聊的弹窗显隐
  const handleCreate = () => {
    setCreateModal(!openCreateModal);
  };
  const addContent = (
    <ul>
      <li onClick={handleCreate}>创建群聊</li>
      <li onClick={handleAdd}>加好友/加群</li>
    </ul>
  );
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.avatar}>
            <img src={avatar} alt="" />
          </div>
        <div className={styles.iconList}>
            <ul className={styles.topIcons}>
              {iconList.slice(0, 5).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        if (item.text == '聊天' || item.text == '通讯录') {
                          setCurrentIcon(item.icon);
                        }
                      }}
                      style={{
                        color: currentIcon === item.icon ? '#07c160' : '#979797',
                      }}
                    ></li>
                  </Tooltip>
                );
              })}
            </ul>
            <ul className={styles.bottomIcons}>
              {iconList.slice(5, 8).map((item) => {
                return (
                  <Tooltip key={item.text} placement="bottomLeft" title={item.text} arrow={false}>
                    <li
                      className={`iconfont ${item.icon}`}
                      onClick={() => {
                        setCurrentIcon(item.text);
                      }}
                      style={{ color: currentIcon === item.text ? '#07c160' : '#979797' }}
                    ></li>
                  </Tooltip>
                );
              })}
            </ul>
          </div>
        </div>
        <div className={styles.middleContainer}>
          <div className={styles.middleTop}>
            <div className={styles.searchBox}>
              <Input size="small" placeholder="搜索" prefix={<SearchOutlined />} />
            </div>
            <Tooltip placement="bottomLeft" title={addContent} arrow={false} overlayClassName="addContent">
              <div className={styles.addBox}>
                <PlusOutlined />
              </div>
            </Tooltip>
          </div>
          <div className={styles.middleBottom}>{currentIcon === 'icon-message' ? <ChatList /> : <AddressBook />}</div>
        </div>
        <div className={styles.rightContainer}></div>
      </div>
      {
        // 添加好友或群聊弹窗
        openAddModal && <AddFriendOrGroupModal openmodal={openAddModal} handleAdd={handleAdd} />
      }
      {
        // 创建群聊弹窗
        openCreateModal && <CreateGroupModal openmodal={openCreateModal} handleCreate={handleCreate} />
      }
    </>
  );
};
export default Container;