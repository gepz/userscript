import Swal from 'sweetalert2';

export default Swal.mixin({
  toast: true,
  position: 'bottom-left',
  timer: 2500,
  timerProgressBar: true,
  showConfirmButton: false,
  didOpen: (toast) => {
    toast.addEventListener('pointerenter', Swal.stopTimer);
    toast.addEventListener('pointerleave', Swal.resumeTimer);
  },
});
