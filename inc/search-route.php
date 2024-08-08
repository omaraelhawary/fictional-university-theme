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
        if(get_post_type() == 'post' || get_post_type() == 'page'){
            array_push($results['universityPosts'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
            ));
        }
        if(get_post_type() == 'professor'){
            array_push($results['universityProf'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
            ));
        }
        if(get_post_type() == 'program'){
            array_push($results['universityProg'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
            ));
        }
        if(get_post_type() == 'professor'){
            array_push($results['universityPosts'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
            ));
        }
        if(get_post_type() == 'campus'){
            array_push($results['universityCamp'], array(
                'title' => get_the_title(),
                'link' => get_the_permalink(),
            ));
        }
        
    }

    return $results;
}