document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const statusMessage = document.getElementById('statusMessage');
  
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = new FormData(registrationForm);
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        statusMessage.textContent = 'Registration failed. Please try again.';
        return;
      }
  
      const data = await response.json();
      console.log('User registered successfully:', data);
      statusMessage.textContent = 'User registered successfully.';
      registrationForm.reset();
    });
  });

  // const registerUser = async (userData) => {
  //   try {
  //     const response = await fetch('/api/v1/users/register', { // Update this URL to match your backend endpoint
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(userData),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Failed to register user');
  //     }
  
  //     const data = await response.json();
  //     console.log('User registered successfully:', data);
  //     // Optionally redirect the user to another page or display a success message
  //   } catch (error) {
  //     console.error('Error registering user:', error.message);
  //     // Handle error: display an error message to the user
  //   }
  // };
    