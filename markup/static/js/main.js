import $ from 'jquery'

$('.calc-btn-wrap').on('mousedown', function() {
    $(this).addClass('calc-btn-wrap_toggle');
})
$('.calc-btn-wrap').on('mouseup', function() {
    $(this).removeClass('calc-btn-wrap_toggle');
})