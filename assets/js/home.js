// document.getElementById('next').onclick = function(){
//     let lists = document.querySelectorAll('.item');
//     document.getElementById('slideshow').appendChild(lists[0]);}
//  document.getElementById('prev').onclick = function(){
//     let lists = document.querySelectorAll('.item');
// document.getElementById('slideshow').prepend(lists[lists.length-1]);}

// let Hooks = {}
// Hooks.PhoneNumber = {
//   mounted() {
//     this.el.addEventListener("input", e => {
//       let match = this.el.value.replace(/\D/g, "").match(/^(\d{3})(\d{3})(\d{4})$/)
//       if(match) {
//         this.el.value = `${match[1]}-${match[2]}-${match[3]}`
//       }
//     })
//   }
// }


// let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
// let liveSocket = new LiveSocket("/live", Socket, {
//     params: {_csrf_token: csrfToken},
//     hooks: Hooks
// })
