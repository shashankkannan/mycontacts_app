import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ViewJson = () => {
  const location = useLocation();
  const [contactsData, setContactsData] = useState(location.state?.contactsData || []);
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [selectedContact, setSelectedContact] = useState(null); // Highlighted contact
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [editedContact, setEditedContact] = useState({}); // Editable contact details
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal visibility for adding new contact
  const [newContact, setNewContact] = useState({}); 
  const [errorMessage, setErrorMessage] = useState('');
  const filteredData = contactsData.filter((contact) =>
    Object.keys(filters).every((key) =>
      filters[key] === ''
        ? true
        : contact[key]?.toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    setCurrentPage(1); 
  };

  const handleRowClick = (contact) => {
    setSelectedContact(contact);
    setEditedContact({ ...contact });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContact((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    if (!editedContact.phoneNumber) {
      setErrorMessage('Phone Number is mandatory.');
      return;
    }
    const updatedContacts = contactsData.map((contact) =>
      contact === selectedContact ? editedContact : contact
    );
    setContactsData(updatedContacts);
    setErrorMessage('');
    setSelectedContact(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };
  const addNewContact = () => {
    if (!newContact.phoneNumber) {
      setErrorMessage('Phone Number is mandatory.');
      return;
    }
    setContactsData((prevData) => [...prevData, newContact]);
    setNewContact({});
    setErrorMessage('');
    setIsAddModalOpen(false);
  };

  const saveToJsonFile = () => {
    const jsonBlob = new Blob([JSON.stringify(contactsData, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(jsonBlob);
    link.download = 'contactsData.json';
    link.click();
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleDeleteContact = (contactToDelete) => {
    setContactsData((prevContacts) =>
      prevContacts.filter((contact) => contact !== contactToDelete)
    );
  };
  const handleNewContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Contacts</h1>

      <button
        onClick={saveToJsonFile}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Save to JSON
      </button>

      <button
        onClick={() => setIsAddModalOpen(true)}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Add New Contact
      </button>

      <div style={{ marginBottom: '20px' }}>
        <h3>Search Filters</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.keys(filters).map((key) => (
            <input
              key={key}
              type="text"
              name={key}
              value={filters[key]}
              onChange={handleFilterChange}
              placeholder={`Search by ${key}`}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: '1 1 calc(20% - 10px)',
                minWidth: '150px',
              }}
            />
          ))}
        </div>
      </div>

      {currentData.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No matching records found.</p>
      ) : (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: '20px 0',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <thead>
            <tr style={{ background: '#f4f4f4' }}>
            <th style={thStyle}>First Name</th>
                  <th style={thStyle}>Last Name</th>
                  <th style={thStyle}>Date of Birth</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone Number</th>
                  <th style={thStyle}>Address</th>
                  <th style={thStyle}>City</th>
                  <th style={thStyle}>State</th>
                  <th style={thStyle}>Zip Code</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((contact, index) => (
              <tr
                key={index}
                style={{
                  textAlign: 'left',
                  backgroundColor:
                    selectedContact === contact ? '#cce5ff' : 'transparent',
                  cursor: 'pointer',
                }}
                onClick={() => handleRowClick(contact)}
              >
                <td style={tdStyle}>{contact.firstName || ''}</td>
                    <td style={tdStyle}>{contact.lastName || ''}</td>
                    <td style={tdStyle}>{contact.dateOfBirth || ''}</td>
                    <td style={tdStyle}>{contact.email || ''}</td>
                    <td style={tdStyle}>{contact.phoneNumber}</td>
                    <td style={tdStyle}>{contact.addressLine1 || ''}</td>
                    <td style={tdStyle}>{contact.city || ''}</td>
                    <td style={tdStyle}>{contact.state || ''}</td>
                    <td style={tdStyle}>{contact.zipCode || ''}</td>
                    <td style={tdStyle}>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              handleDeleteContact(contact);
            }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
          </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Add New Contact</h2>
            {errorMessage && (
              <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>
            )}
            <input
              type="text"
              name="firstName"
              value={newContact.firstName || ''}
              onChange={handleNewContactChange}
              placeholder="First Name"
              style={inputStyle}
            />
            <input
              type="text"
              name="lastName"
              value={newContact.lastName || ''}
              onChange={handleNewContactChange}
              placeholder="Last Name"
              style={inputStyle}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={newContact.dateOfBirth || ''}
              onChange={handleNewContactChange}
              placeholder="Date of Birth"
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              value={newContact.email || ''}
              onChange={handleNewContactChange}
              placeholder="Email"
              style={inputStyle}
            />
            <input
              type="text"
              name="phoneNumber"
              value={newContact.phoneNumber || ''}
              onChange={handleNewContactChange}
              placeholder="Phone Number (Required)"
              style={inputStyle}
            />
            <input
              type="text"
              name="address"
              value={newContact.address || ''}
              onChange={handleNewContactChange}
              placeholder="Address"
              style={inputStyle}
            />
            <input
              type="text"
              name="city"
              value={newContact.city || ''}
              onChange={handleNewContactChange}
              placeholder="City"
              style={inputStyle}
            />
            <input
              type="text"
              name="state"
              value={newContact.state || ''}
              onChange={handleNewContactChange}
              placeholder="State"
              style={inputStyle}
            />
            <input
              type="text"
              name="zipCode"
              value={newContact.zipCode || ''}
              onChange={handleNewContactChange}
              placeholder="Zip Code"
              style={inputStyle}
            />
            <div>
              <button onClick={addNewContact} style={buttonStyle}>
                Add
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={buttonStyle}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    

      {/* Pagination */}
      <div style={paginationStyle}>
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          style={paginationButtonStyle}
        >
          First
        </button>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationButtonStyle}
        >
          Previous
        </button>
        <span style={paginationInfoStyle}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={paginationButtonStyle}
        >
          Next
        </button>
        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          style={paginationButtonStyle}
        >
          Last
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>Contact Details</h2>
            {errorMessage && (
              <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>
            )}
            <p>
              <strong>Name: </strong>
              <input
                type="text"
                name="firstName"
                value={editedContact.firstName || ''}
                onChange={handleInputChange}
                placeholder="First Name"
                style={inputStyle}
              />
              <input
                type="text"
                name="lastName"
                value={editedContact.lastName || ''}
                onChange={handleInputChange}
                placeholder="Last Name"
                style={inputStyle}
              />
            </p>
            <p>
              <strong>Email: </strong>
              <input
                type="email"
                name="email"
                value={editedContact.email || ''}
                onChange={handleInputChange}
                placeholder="Email"
                style={inputStyle}
              />
            </p>
            <p>
              <strong>Phone Number: </strong>
              <input
                type="text"
                name="phoneNumber"
                value={editedContact.phoneNumber || ''}
                onChange={handleInputChange}
                placeholder="Phone Number"
                style={inputStyle}
              />
            </p>
            <p>
              <strong>Address: </strong>
              <input
                type="text"
                name="addressLine1"
                value={editedContact.addressLine1 || ''}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                style={inputStyle}
              />
              <input
                type="text"
                name="city"
                value={editedContact.city || ''}
                onChange={handleInputChange}
                placeholder="City"
                style={inputStyle}
              />
              <input
                type="text"
                name="state"
                value={editedContact.state || ''}
                onChange={handleInputChange}
                placeholder="State"
                style={inputStyle}
              />
              <input
                type="text"
                name="zipCode"
                value={editedContact.zipCode || ''}
                onChange={handleInputChange}
                placeholder="Zip Code"
                style={inputStyle}
              />
            </p>
            <div>
              <button onClick={saveChanges} style={buttonStyle}>
                Save
              </button>
              <button onClick={handleCloseModal} style={buttonStyle}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
};

const paginationStyle = {
  display: 'flex',
  justifyContent: 'center',
  margin: '20px 0',
};

const paginationButtonStyle = {
  padding: '10px 20px',
  margin: '0 10px',
  cursor: 'pointer',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
};

const paginationInfoStyle = {
  alignSelf: 'center',
  padding: '0 10px',
};

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: '400px',
};

const inputStyle = {
  padding: '8px',
  margin: '5px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px 5px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '4px',
};

export default ViewJson;
