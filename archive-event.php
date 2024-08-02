<?php 
  get_header(); 
  pageBannersection(array(
    'title' => 'All Events',
    'subtitle' => 'Here are all Events'
  ));
?>

<div class="container container--narrow page-section">
    <?php
        while(have_posts()) {
          the_post();
          get_template_part( 'templates-parts/content', get_post_type());
        }
        echo paginate_links();
      ?>
    <hr class="section-break">
    <p> Looking for recap of past events? <a href='<?php echo site_url("/past-events"); ?>'>
            Check out our past events archive.</a> </p>
</div>


<?php get_footer(); ?>