$(document).ready(function () {
  $(".portfolio-card__slick").slick({
    responsive: [
      {
        breakpoint: 576,
        settings: {
          dots: false,
        },
      },
    ],
    dots: true,
    prevArrow: `  <button class="portfolio-card__prev">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="81"
        height="8"
        viewBox="0 0 81 8"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.82843 7.5352L0.646446 4.35322C0.451187 4.15796 0.451187 3.84138 0.646446 3.64611L3.82843 0.464133C4.02369 0.26887 4.34027 0.26887 4.53554 0.464133C4.7308 0.659395 4.7308 0.975978 4.53554 1.17124L2.20711 3.49967L81 3.49966L81 4.49966L2.20711 4.49967L4.53554 6.82809C4.7308 7.02336 4.7308 7.33994 4.53554 7.5352C4.34027 7.73046 4.02369 7.73046 3.82843 7.5352Z"
        />
      </svg>
    </button>`,
    nextArrow: ` <button class="portfolio-card__next">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="81"
        height="8"
        viewBox="0 0 81 8"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M77.1716 0.464806L80.3536 3.64679C80.5488 3.84205 80.5488 4.15863 80.3536 4.35389L77.1716 7.53587C76.9763 7.73114 76.6597 7.73114 76.4645 7.53587C76.2692 7.34061 76.2692 7.02403 76.4645 6.82877L78.7929 4.50034H0V3.50034H78.7929L76.4645 1.17191C76.2692 0.976651 76.2692 0.660068 76.4645 0.464806C76.6597 0.269544 76.9763 0.269544 77.1716 0.464806Z"
        />
      </svg>
    </button>`,
  });

  //youtube script page

  let tag = document.createElement("script");
  tag.src = "//www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  let player;

  let videoId = $("#player").attr("data-videoId");

  onYouTubeIframeAPIReady = function () {
    player = new YT.Player("player", {
      videoId: videoId, // youtube video id
      playerVars: {
        autoplay: 0,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onStateChange: onPlayerStateChange,
      },
    });

    playerPopup = new YT.Player("player-popup", {
      videoId: videoIdPopup, // youtube video id
      playerVars: {
        autoplay: 0,
        rel: 0,
        showinfo: 0,
      },
      events: {
        onStateChange: onPlayerStateChangePopup,
      },
    });
  };

  let p = $("#player");
  $(p).hide();

  let t = $(".portfolio-card__preview");
  t.attr("src", `http://img.youtube.com/vi/${videoId}/0.jpg`);

  onPlayerStateChange = function (event) {
    if (event.data == YT.PlayerState.ENDED) {
      $(".portfolio-card__start-video").fadeIn("normal");
    }
  };

  $(document).on("click", ".portfolio-card__start-video", function () {
    $(this).hide();
    $("#player").show();
    $("#thumbnail_container").hide();
    console.log(player);
    player.playVideo();
  });

  //youtube script popup

  let tagPopup = document.createElement("script");
  tagPopup.src = "//www.youtube.com/iframe_api";
  let firstScriptTagPopup = document.getElementsByTagName("script")[0];
  firstScriptTagPopup.parentNode.insertBefore(tag, firstScriptTag);

  let playerPopup;

  let videoIdPopup = $("#player-popup").attr("data-videoId");

  let pPopup = $("#player-popup");
  $(pPopup).hide();

  let tPopup = $("#preview-popup");
  tPopup.attr("src", `http://img.youtube.com/vi/${videoId}/0.jpg`);

  onPlayerStateChangePopup = function (event) {
    if (event.data == YT.PlayerState.ENDED) {
      $(".portfolio-card__start-video").fadeIn("normal");
    }
  };

  $(".portfolio-card__start-video--popup").on("click", function () {
    $(this).hide();
    $("#player-popup").show();
    $("#thumbnail_container-popup").hide();
    console.log(playerPopup);
    playerPopup.playVideo();
  });

  // ==

  $(".portfolio-card__video-btn").click(function () {
    $(".portfolio-card__popup").fadeIn(400);
    $("html body").css({ overflow: "hidden" });
    player.pauseVideo();

    function removePopup() {
      $(".portfolio-card__popup").fadeOut(400);
      $(".portfolio-card__close").off("click", removePopup);
      $("html body").removeAttr("style");
      playerPopup.pauseVideo();
    }

    $(".portfolio-card__close").click(removePopup);
    $(".portfolio-card__popup-overlay").click(removePopup);
  });
});
// services
$(document).ready(function () {
  var $status = $(".count");
  var $slickElement = $(".services__list--main");

  $(".services__list--main").on(
    "init",
    function (event, slick, currentSlide, nextSlide) {
      var i = (currentSlide ? currentSlide : 0) + 1;
      $status.html(i + "<span class='slash'> / </span>" + slick.slideCount);
    }
  );

  $slickElement.slick({
    arrows: false,
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          // slidesToShow: 1,
          dots: false,
          variableWidth: true,
          slidesToScroll: 1,
        },
      },
    ],
  });

  let servicesPrev = $(".services__arrow--left");
  let servicesNext = $(".services__arrow--right");

  servicesPrev.click(function () {
    $slickElement.slick("slickPrev");
  });

  servicesNext.click(function () {
    $slickElement.slick("slickNext");
  });

  $slickElement.on(
    "afterChange",
    function (event, slick, currentSlide, nextSlide) {
      var i = (currentSlide ? currentSlide : 0) + 1;
      $status.html(i + "<span class='slash'> / </span>" + slick.slideCount);
    }
  );

  if ($(window).width() <= 1024) {
    $(".services__list--tab").on(
      "init",
      function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.html(i + "<span class='slash'> / </span>" + slick.slideCount);
      }
    );

    $(".services__list--tab").on(
      "afterChange",
      function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.html(i + "<span class='slash'> / </span>" + slick.slideCount);
      }
    );

    $(".services__list--tab").slick({
      arrows: false,
      slidesToShow: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            dots: false,
            variableWidth: true,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

  $(window).resize(function () {
    $(".services__list--main").slick("resize");
    $(".services__list--tab").slick("resize");

    $(".services__list--main").on(
      "init",
      function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.html(i + "<span class='slash'> / </span>" + slick.slideCount);
      }
    );

    $(".services__list--tab").on(
      "afterChange",
      function (event, slick, currentSlide, nextSlide) {
        var i = (currentSlide ? currentSlide : 0) + 1;
        $status.html(i + "<span class='slash'> / </span>" + slick.slideCount);
      }
    );
  });

  $(".services__step-list").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    vertical: true,
    centerMode: true,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          vertical: false,
          variableWidth: true,
          centerMode: false,
        },
      },
    ],
  });
});
