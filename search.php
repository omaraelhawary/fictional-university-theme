<?php
 get_header(); 
 pageBannersection(array(
  'title' => 'Search Results',
  'subtitle' => 'You shearch for &ldquo;' . esc_html(get_search_query()) . '&rdquo;.'
  ));
?>

<div class="container container--narrow page-section">
    <?php
        while(have_posts()) {
          the_post();
          get_template_part( 'templates-parts/content', get_post_type() );
      ?>
   
    <?php
        }
        echo paginate_links()
      ?>
</div>


<?php get_footer(); ?>