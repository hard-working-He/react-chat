import styles from './index.module.less'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tooltip, Modal, Button, message, Input } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import ChangePwdModal from '@/components/ChangePwdModal'
import ChangeInfoModal from '@/components/ChangeInfoModal'
import ChatList from './ChatList'
import AddressBook from './AddressBook'
import { iconList } from './variable'
import { menuIconList } from '@/assets/icons'
import { userStorage, clearSessionStorage } from '@/common/storage'

const Container = () => {
  const { username, avatar, phone, signature } = JSON.parse(
    userStorage.getItem() || '{}'
  )
  const [currentIcon, setCurrentIcon] = useState<string>('icon-message')
  const [openAddModal, setAddModal] = useState(false)
  const [openCreateModal, setCreateModal] = useState(false)
  const [openForgetModal, setForgetModal] = useState(false)
  const [openInfoModal, setInfoModal] = useState(false)
  // 控制修改密码的弹窗显隐
  const handleForget = () => {
    setForgetModal(!openForgetModal)
  }
  // 控制修改信息的弹窗显隐
  const handleInfo = () => {
    setInfoModal(!openInfoModal)
  }
  // 点击头像用户信息弹窗
  const infoContent = (
    <div className={styles.infoContent}>
      <div className={styles.infoContainer}>
        <div className={styles.avatar}>
          <img src={avatar} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.name}></div>
          <div className={styles.phone}>手机号：{phone}</div>
          <div className={styles.signature}>
            {signature === '' ? '暂无个性签名' : signature}
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <Button
          onClick={() => {
            handleForget()
          }}
        >
          修改密码
        </Button>
        <Button
          onClick={() => {
            handleInfo()
          }}
        >
          修改信息
        </Button>
      </div>
    </div>
  )
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
          {currentIcon === 'icon-message' ? <ChatList /> : <AddressBook />}
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
