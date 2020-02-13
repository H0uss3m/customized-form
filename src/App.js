import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Select from 'react-select'
import MySelect from './MySelect'
import './App.css'
var _ = require('lodash')
export default function App () {
  const titleInput = useRef('')
  const messageInput = useRef('')
  const [usersList, setUsersList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [filtredUsers, setFiltredUsers] = useState([])
  const [selectedOption, SetSelectedOption] = useState([])
  const [title, setTitle] = useState('')
  const [messageToSend, setMessageToSend] = useState('')
  useEffect(() => {
    getUsersData()
  }, [])
  const getUsersData = async () => {
    const DataFetching = await axios.get(
      'http://37.187.146.184:6060/getParticipants'
    )
    const data = await DataFetching.data
    const typeData = _.uniqBy(
      data.map(user => {
        return { value: user.type, label: user.type }
      }),
      'label'
    )
    typeData.unshift({ value: 'Tous', label: 'Tous' })
    setTypeList(typeData)
    setUsersList(data)
    setFiltredUsers(data)
  }
  const handleChange = event => {
    if (event.value !== 'Tous') {
      setFiltredUsers([...usersList.filter(user => user.type === event.value)])
    } else {
      setFiltredUsers(usersList)
    }
  }
  const handleUsersChange = Option => {
    if (Option === null) {
      SetSelectedOption([])
    } else {
      SetSelectedOption(Option)
    }
  }
  const handleSend = () => {
    setMessageToSend(messageInput.current.value.trim())
    setTitle(titleInput.current.value.trim())
    if (
      selectedOption.length > 0 &&
      messageInput.current.value.trim().length > 0 &&
      titleInput.current.value.trim().length > 0
    ) {
      axios
        .post(
          `http://37.187.146.184:5050/sendNotification?title=${title}&body=${messageToSend}&participants=${selectedOption.map(
            user => user.id
          )}`
        )
        .then(res => {
          if (res.data.message === 'success') {
            window.alert('Message envoyer')
          } else {
            window.alert('tous les champs doit etre remplient')
          }
          SetSelectedOption([])
          titleInput.current.value = ''
          messageInput.current.value = ''
        })
    } else {
      window.alert('tous les champs doit etre remplient')
    }
  }
  const handleInputChange = () => {}

  return (
    <div className='container'>
      <div className='summit-logo'>
        <img
          width='108'
          height='85'
          src='https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled.png'
          className='custom-logo'
          alt='TDS Conference'
          srcSet='https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled.png 60w, https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled-300x194.png 30w, https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled-1024x662.png 14w, https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled-768x497.png 68w, https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled-1536x994.png 36w, https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled-2048x1325.png 48w, https://www.digitalsummit.tn/fr/wp-content/uploads/2019/12/cropped-logo-TDS-blanc-scaled-1670x1080.png  57w'
          sizes='(max-width: 60px) 10vw, 60px'
        />
      </div>
      <div>
        <div className='row'>
          <div className='col-md-6'>
            <label>Catégories </label>
            <Select
              onChange={handleChange}
              className='basic-single'
              classNamePrefix='select'
              options={typeList}
            />
          </div>
          <div className='col-md-6'>
            <label>Utilisateurs </label>
            <MySelect
              allowSelectAll={true}
              isMulti
              closeMenuOnSelect={false}
              onChange={handleUsersChange}
              options={filtredUsers.map(user => {
                return {
                  value: user.nom + user.prenom,
                  label: user.prenom + ' ' + user.nom,
                  id: user.id
                }
              })}
              value={_.uniqBy(
                selectedOption.filter(
                  user => user.label !== 'Sélectionner tout'
                ),
                'id'
              )}
              placeholder='Utilisateur'
            />
          </div>
        </div>
        <div style={{ marginTop: '3%', marginBottom: '3%' }} className='row'>
          <div
            style={{
              marginTop: '2%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className='col-md-10'
          >
            <label style={{ marginRight: '1%' }}>Objet du message </label>
            <input
              onChange={handleInputChange}
              ref={titleInput}
              placeholder='titre du message'
              style={{ width: '70%', outline: 'none', height: '38px' }}
              type='text'
            />
          </div>
        </div>
        <div className='row'>
          <div style={{ textAlign: 'center' }} className='col-md-12'>
            <textarea
              onChange={handleInputChange}
              ref={messageInput}
              placeholder='Ecrire un message ...'
              rows='15'
              cols='33'
              style={{ width: '100%', outline: 'none', marginTop: '1%' }}
              type='text'
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '3%',
            marginRight: '0.3%'
          }}
          className='row'
        >
          <button className='myButton' onClick={handleSend}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
