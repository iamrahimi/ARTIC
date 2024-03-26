// JavaScript Document

$(window).load(function () {
    "use strict";
    // makes sure the whole site is loaded
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(350).css({
        'overflow': 'visible'
    });
})

$(document).ready(function () {
    "use strict";

    // scroll menu
    var sections = $('.section'),
        nav = $('.navbar-fixed-top,footer'),
        nav_height = nav.outerHeight();

    $(window).on('scroll', function () {
        var cur_pos = $(this).scrollTop();

        sections.each(function () {
            var top = $(this).offset().top - nav_height,
                bottom = top + $(this).outerHeight();

            if (cur_pos >= top && cur_pos <= bottom) {
                nav.find('a').removeClass('active');
                sections.removeClass('active');

                $(this).addClass('active');
                nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('active');
            }
        });
    });

    nav.find('a').on('click', function () {
        var $el = $(this),
            id = $el.attr('href');

        $('html, body').animate({
            scrollTop: $(id).offset().top - nav_height + 2
        }, 600);

        return false;
    });


    // Menu opacity
    if ($(window).scrollTop() > 80) {
        $(".navbar-fixed-top").addClass("bg-nav");
    } else {
        $(".navbar-fixed-top").removeClass("bg-nav");
    }
    $(window).scroll(function () {
        if ($(window).scrollTop() > 80) {
            $(".navbar-fixed-top").addClass("bg-nav");
        } else {
            $(".navbar-fixed-top").removeClass("bg-nav");
        }
    });



    // Parallax
    var parallax = function () {
        $(window).stellar();
    };

    $(function () {
        parallax();
    });

    // AOS
    AOS.init({
        duration: 1200,
        once: true,
        disable: 'mobile'
    });

    //  isotope
    $('#projects').waitForImages(function () {
        var $container = $('.portfolio_container');
        $container.isotope({
            filter: '*',
        });

        $('.portfolio_filter a').click(function () {
            $('.portfolio_filter .active').removeClass('active');
            $(this).addClass('active');

            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 500,
                    animationEngine: "jquery"
                }
            });
            return false;
        });

    });


    $.get('https://api.artic.edu/api/v1/artworks/2816', function (data) {
        data = data.data;
        $('#description').html(`
            <div class="col-md-6" data-aos="fade-up" >
              <h4>01</h4>
              <h1 class="size-50">`+data.artist_display+`</h1>
              <div class="h-50"></div>
                <p>`+data.description+`</p>
              <div class="h-50"></div>
            </div>
            <div class="col-md-6 about-img-div">
                <div class="about-border" data-aos="fade-up" data-aos-delay=".5"></div>
                <img id="autherImage" src="https://www.artic.edu/iiif/2/`+data.image_id+`/full/843,/0/default.jpg" width="400" class="img-responsive" alt="" align="right" data-aos="fade-right" data-aos-delay="0" />
            </div>
        `);
      })

      $.get('https://api.artic.edu/api/v1/artworks?page=1&limit=5', function (data) {
        data = data.data;
        var networkData = 
        `<ul class="timeline">`;
          for(var row=0; row < data.length; row++ ){
          
            networkData+=` <li class="timeline-event" data-aos="fade-up">
                <label class="timeline-event-icon"></label>
                <div class="timeline-event-copy">
                    <p class="timeline-event-thumbnail">`+data[row]['date_start']+` - `+ data[row]['date_end']+`</p>
                    <h3>`+data[row]['artist_title']+`</h3>
                    <h4>`+data[row]['api_model']+`</h4>
                    <p><strong>`+data[row]['artist_display']+`</strong>
                        <br>`+data[row]['description']+`</p>
                </div>
            </li>`;
          };
            
          networkData+`</ul>`;
        $('#network').html(networkData);
       
      })

      $.get('https://api.artic.edu/api/v1/artworks?page=2&limit=9', function (data) {
        pagination(data.pagination);
        data = data.data;
        artwork_main_content_setup(data);
      })

      $("body").on('click','.portfolio_item', function (){
        var id = $(this).attr('artist_id');
        $.get('https://api.artic.edu/api/v1/artworks/'+id, function (data) {
          data = data.data;
          $('#description').html(`
              <div class="col-md-6" data-aos="fade-up" >
                <h4>01</h4>
                <h1 class="size-50">`+data.artist_display+`</h1>
                <div class="h-50"></div>
                  <p>`+data.description+`</p>
                <div class="h-50"></div>
              </div>
              <div class="col-md-6 about-img-div">
                  <div class="about-border" data-aos="fade-up" data-aos-delay=".5"></div>
                  <img id="autherImage" src="https://www.artic.edu/iiif/2/`+data.image_id+`/full/843,/0/default.jpg" width="400" class="img-responsive" alt="" align="right" data-aos="fade-right" data-aos-delay="0" />
              </div>
          `);
        
          $('#abouttop').click();
        
        })
      }) 

      function artwork_main_content_setup(data){
       
        var networkData = 
        ` <!-- single work -->`;
          for(var row=0; row < data.length; row++ ){
            
            networkData+=` 
            <div class="col-md-4 col-sm-6 overflow-hidden box-size-380">
              <a id="demo01" href="#`+data[row].id+`" artist_id='`+data[row].id+`' class="portfolio_item"> <img src="https://www.artic.edu/iiif/2/`+data[row].image_id+`/full/843,/0/default.jpg" alt="image" class="img-responsive" />
                  <div class="portfolio_item_hover">
                      <div class="portfolio-border clearfix">
                          <div class="item_info"> <span>`+data[row].artist_title+`</span> <em>`+data[row].artist_display +`</em> </div>
                      </div>
                  </div>
              </a>
            </div>`;
          };
         
         $('#contents').html(networkData); 
      }

      function pagination (data){
        var paginationHTML = 
          `
            <a href=#prev link='`+data.prev_url+`' class='pagination_link' ><i class=ion-chevron-left></i></a>
              <ul>`;
                if(data.current_page > 1) 
                  paginationHTML += `<li ><a href=#1 link="https://api.artic.edu/api/v1/artworks?page=1&limit=9" class='pagination_link'>1</a>
                    <li><a href=#3 link=#>…</a>`;
               
                paginationHTML+= `  
                    <li class=current><a href=#`+data.current_page+` link="https://api.artic.edu/api/v1/artworks?page=`+data.current_page+`&limit=9" class='pagination_link'>`+data.current_page+`</a>
                <li><a href=#`+(data.current_page+ 1 )+` link='https://api.artic.edu/api/v1/artworks?page=`+(data.current_page+ 1 )+`&limit=9' class='pagination_link'>`+(data.current_page+ 1 )+`</a>
                <li><a href=#`+(data.current_page+ 2 )+` link='https://api.artic.edu/api/v1/artworks?page=`+(data.current_page+ 2 )+`&limit=9' class='pagination_link'>`+(data.current_page+ 2 )+`</a>
                <li><a href=#3 link=#>…</a>
                <li><a href=#`+data.total_pages+` link='https://api.artic.edu/api/v1/artworks?page=`+data.total_pages+`&limit=9' class='pagination_link'>`+data.total_pages+`</a>
              </ul>
            <a href=#next link='`+data.next_url+`' class='pagination_link'><i class=ion-chevron-right></i></a>
          `;

          $('#pagination').html(paginationHTML)
      }

      $('body').on('click','.pagination_link', function () {
        var link =  $(this).attr('link');
      

        $('#contents').html(`
        <!-- Preloader -->
            <div id="preloader1">
              <div id="status">
                  <div class="preloader preloader-content" aria-busy="true" aria-label="Loading, please wait." role="progressbar">
                  </div>
              </div>
            </div>
            <!-- ./Preloader -->
        `);
       
        $.get(link, function (data) {
          pagination(data.pagination);
          data = data.data;
          artwork_main_content_setup(data);
        })
      })

});