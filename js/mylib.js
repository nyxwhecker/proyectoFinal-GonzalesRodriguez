// Sweet Alert

const btn = document.querySelector('#btn')
btn.addEventListener('click', miAlerta)

async function miAlerta() {
  const { value: formValues } = await Swal.fire({
    title: 'Registrar / Iniciar sesion',
    html:
      '<h2 class="swal2-title" id="swal2-title" style="display: block;">User:</h2>' +
      '<input id="swal-input1" class="swal2-input">' +
      '<h2 class="swal2-title" id="swal2-title" style="display: block;">password:</h2>' +
      '<input id="swal-input2" class="swal2-input">',
    focusConfirm: false,
    preConfirm: () => {
      return [
        
        document.getElementById('swal-input1').value,
        document.getElementById('swal-input2').value
      ]
    }
  })

  if (formValues) {
    Swal.fire(JSON.stringify(formValues)).then(() => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      });
    });
  }
}


/*
  if (formValues) {
    Swal.fire(JSON.stringify(formValues))
  }
}

Swal.fire({
  position: 'top-end',
  icon: 'success',
  title: 'Your work has been saved',
  showConfirmButton: false,
  timer: 1500
})*/