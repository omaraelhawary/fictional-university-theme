<?php
    get_header();
    while(have_posts()){
        the_post();
        pageBannersection();
 
?>
<div class="container container--narrow page-section">
    <div class="metabox metabox--position-up metabox--with-home-link">
        <p>
            <a class="metabox__blog-home-link" href=" <?php echo get_post_type_archive_link( get_post_type() ) ?> ">
                <i class="fa fa-home" aria-hidden="true"></i> <?php echo get_post_type() ?> Home
            </a>
            <span class="metabox__main">
                <?php the_title(); ?>
            </span>
        </p>
    </div>
    <div class="generic-content">
        <?php the_content(); ?>
    </div>

    <?php
        $relatedPrograms = get_field('related_programs');

        if ($relatedPrograms){
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium"> Related Program(s) </h2>';
            echo '<ul class="link-list min-list">';
    
            foreach($relatedPrograms as $program){ ?>
    <li>
        <a href="<?php echo get_the_permalink($program); ?>">
            <?php echo get_the_title( $program );?>
        </a>
    </li>

    <?php
                
            }
            echo '</ul>';
        }
        wp_reset_postdata();
        $relatedCampuses = get_field('related_campuses');
        if($relatedCampuses){
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium"> Event Location(s) </h2>';
            echo '<ul class="link-list min-list">';
            foreach($relatedCampuses as $campus){
                ?>
    <li class='link-list__item'>
        <a href='<?php echo get_the_permalink($campus) ?>'><?php echo get_the_title($campus) ?></a>
    </li>
    <?php 
            }
        }
    ?>
</div>
<?php
    }
    get_footer();
?>