import React, { useState, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {

  const contactContext = useContext(ContactContext);

  const { addContact, current, clearCurrent, updateContact } = contactContext;


  // this is called if the contactContext or current changes
  useEffect(() => {

    if (current !== null) {
      setContact(current);
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal'
      });
    }

  }, [contactContext, current]);

  // useState() returns a pair of values: the current state and a function that updates it
  // useState() accepts the initial state as argument
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal'
  });

  // extract the variables from within the contact state variable
  const { name, email, phone, type } = contact;

  const onChange = e => {
    setContact({
      /* 
        '...' is the 'spread' operator. Basically what happens here is that the variables that already are
         within the 'contact' object will be spread/placed within the object
      
        e is the event that gets passed into the onChange function. e.target is the element that the event was fired
        from. So 'e.target.name' will be either 'name', 'email', 'phone' or type. So with this command we tell that the state of the contact attribut with the name that is passed in should be updated
      */
      ...contact,
      [e.target.name]: e.target.value
    });
  }

  const onSubmit = e => {
    e.preventDefault();

    if (current === null) {
      addContact(contact);
    } else {
      updateContact(contact);
    }

    // clear form
    setContact({
      name: '',
      email: '',
      phone: '',
      type: 'personal'
    });
  }

  const clearAll = () => {
    clearCurrent();
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">{current ? 'Edit Contact' : 'Add Contact'}</h2>
      <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
      <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
      <input type="text" placeholder="Phone" name="phone" value={phone} onChange={onChange} />
      <h5>Contact Type</h5>
      <input type="radio" name="type" id="" value="personal" checked={type === 'personal'} onChange={onChange} /> Personal{' '}
      <input type="radio" name="type" id="" value="professional" checked={type === 'professional'} onChange={onChange} /> Professional{' '}
      <div>
        <input type="submit" value={current ? 'Update Contact' : 'Add Contact'} className="btn btn-primary btn-block" />
      </div>
      {current && <div>
        <button className="btn btn-light btn-block" onClick={clearAll}>Clear Form</button>
      </div>}
    </form>
  )
}

export default ContactForm;