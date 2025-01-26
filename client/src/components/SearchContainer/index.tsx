import { Tooltip, Input } from 'antd';
import { useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import AddFriendOrGroupModal from '@/components/AddFriendOrGroupModal';
import CreateGroupModal from '@/components/CreateGroupModal';
import styles from './index.module.less';
const SearchContainer = () => {
  const [openAddModal, setAddModal] = useState(false);
  const [openCreateModal, setCreateModal] = useState(false);
  // 控制添加好友/群聊的弹窗显隐
  const handleAdd = () => {
    setAddModal(!openAddModal);
  };
  // 控制创建群聊的弹窗显隐
  const handleCreate = () => {
    setCreateModal(!openCreateModal);
  };
  const addContent = (
    <ul>
      <li onClick={handleAdd}>加好友/加群</li>
      <li onClick={handleCreate}>创建群聊</li>
    </ul>
  );
  return (
    <>
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <Input size="small" placeholder="搜索" prefix={<SearchOutlined />} />
        </div>
        <Tooltip placement="bottomLeft" title={addContent} arrow={false} overlayClassName="addContent">
          <div className={styles.addBox}>
            <PlusOutlined />
          </div>
        </Tooltip>
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
export default SearchContainer;