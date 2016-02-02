pjax_config_page('/job-descriptions/job-details', function() {
    return {
        onLoad: function() {
          function showSelectedDiv() {
            $('.sections div').hide();
            $('.sections div[id=' + page.url.params_hash().dept + '-' + page.url.location.hash.substring(1) + ']').show();
          }
          $(window).on('hashchange', function(){
            showSelectedDiv();
          });
          $('.job-details').find('#title').html(page.url.params_hash().dept.replace('_', ' '));
          var source = $('.dept-image').attr('src');
          $('.dept-image').attr('src', source.replace('IT', page.url.params_hash().dept));
          $('.dept-image').show();
          var deptContent = $('#content-' + page.url.params_hash().dept + ' div');
          var sections = ['section-one', 'section-two', 'section-three', 'section-four', 'section-five'];
          $('#sidebar-nav li').slice(deptContent.length).hide();
          $('.sidebar').show();
          for (i = 0; i < deptContent.length; i++) {
              $('#' + page.url.params_hash().dept + '-' + sections[i]).insertAfter('.sections div:last-child');
          }
          $('#' + page.url.location.hash.substring(9)).addClass('selected');
          showSelectedDiv();
          $('#sidebar-nav li').click(function(e) {
            $('#sidebar-nav li').removeClass('selected');
            $(this).addClass('selected');
          });
        }
    }
});
