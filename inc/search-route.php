<?php

function unvierstyRegisterSeach(){
    register_rest_route( 'university/v1', 'search', array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'universitySearchResults'
    ) );
}

add_action('rest_api_init', 'unvierstyRegisterSeach');

function universitySearchResults($data){
    $mainQuery = new WP_Query(array(
        'post_type' => array(
            'post',
            'page',
            'professor',
            'program',
            'event',
            'campus'
        ),
        's' => sanitize_text_field( $data['keyword']),
    ));

    $results = array(
        'universityPosts' => array(),
        'universityProf' => array(),
        'universityProg' => array(),
        'universityEvent' => array(),
        'universityCamp' => array(),
    );
    
    while($mainQuery -> have_posts()){
        $mainQuery -> the_post();
        if(get_post_type() == 'post' OR get_post_type() == 'page'){
            array_push($results['universityPosts'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
                'postType' => get_post_type(),
                'authorName' => get_the_author(),
                
            ));
        }
        if(get_post_type() == 'professor'){
            array_push($results['universityProf'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
                'professorImage' => get_the_post_thumbnail_url(0, 'professorLandscape'),
            ));
        }
        if(get_post_type() == 'program'){
            $relatedCampuses = get_field('related_campuses');

            if($relatedCampuses){
                foreach($relatedCampuses as $campus){
                    array_push($results['universityCamp'], array(
                        'title' => get_the_title($campus),
                        'link' => get_the_permalink($campus)
                    ));
                }
            }

            array_push($results['universityProg'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
                'id' => get_the_ID(),
            ));
        }
        if(get_post_type() == 'event'){

            $eventDate = new DateTime(get_field('event_date'));
            $description = NULL;
            if(has_excerpt()){
                $description = get_the_excerpt();
            } else {
                $description = wp_trim_words(get_the_Content(), 18); 
            }
            
            array_push($results['universityEvent'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
                'month' => $eventDate -> format('M'),
                'day' => $eventDate -> format('d'),
                'desc' => $description,
            ));
        }
        if(get_post_type() == 'campus'){
            array_push($results['universityCamp'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
            ));
        }
        
    }

    if ($results['universityProg']){

        $programsMetaQuery = array(
            'relation' => 'OR',
        );

        foreach($results['universityProg'] as $program){
            array_push($programsMetaQuery, array(
                'key' => 'related_programs',
                'compare' => 'LIKE',
                'value' => '"' . $program['id'] . '"'
            ));
        }
        $programsRelation = new WP_Query(array(
            'post_type' => array(
                'professor',
                'event',
            ),
            'meta_query' => $programsMetaQuery,
            ),
        );

        while($programsRelation -> have_posts()){
            $programsRelation -> the_post();
            if(get_post_type() == 'professor'){
                array_push($results['universityProf'], array(
                    'title' => get_the_title(),
                    'link' => get_the_permalink(),
                    'professorImage' => get_the_post_thumbnail_url(0, 'professorLandscape'),
                ));
            }

            if(get_post_type() == 'event'){

                $eventDate = new DateTime(get_field('event_date'));
                $description = NULL;
                if(has_excerpt()){
                    $description = get_the_excerpt();
                } else {
                    $description = wp_trim_words(get_the_Content(), 18); 
                }
                
                array_push($results['universityEvent'], array(
                    'title' => get_the_title(),
                    'link' => get_the_permalink(),
                    'month' => $eventDate -> format('M'),
                    'day' => $eventDate -> format('d'),
                    'desc' => $description,
                ));
            }
        }
        
        $results['universityProf'] = array_values(array_unique($results['universityProf'], SORT_REGULAR));
        $results['universityEvent'] = array_values(array_unique($results['universityEvent'], SORT_REGULAR));
    }
    
    return $results;
}
