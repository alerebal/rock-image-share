$('#post-comment').hide();

$('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
})

$('#btn-like').click(function(e) {
    e.preventDefault();
    const imgId = $(this).data('id');
    
    $.post('/images/' + imgId + '/like')
    .done(data => {
        $('.likes-count').text(data.likes)
    })
})

$('.btn-delete').click(function(e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Are you sure?');
    if(response) {
        
        let imgId = $this.data('id');
        let userId = $this[0].value;
        console.log(userId, imgId)

        $.ajax({
            url: '/images/' + imgId,
            type: 'DELETE'
        }) 
        .done(
            $this.find('i').removeClass('fa-times').addClass('fa-check'),
            $this.append('<span>Deleted!</span>')
        )
    }
})

$('.btn-close').click((e) => {
    $('.alert').hide()
})
