import axios from 'axios';
import { showAlert } from './alert';
export const updateSetting = async (data, type) => {
  try {
    const url =
      type === 'Password'
        ? 'http://localhost:3001/api/v1/user/updateMyPassword'
        : 'http://localhost:3001/api/v1/user/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data: data,
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type} is updated successfully!`);
      if (type === 'Password') {
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
      }
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
