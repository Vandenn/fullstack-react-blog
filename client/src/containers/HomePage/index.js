import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { actions } from 'actions/ui/homePage';
import PostPreview from 'components/PostPreview';
import {
  makePostListPageNumberSelector,
  makeNumberOfPostsPerPageSelector,
  makeVisiblePostsIdsSelector,
} from 'selectors/ui/homePage';
import styles from './styles';

const useStyles = makeStyles(styles);

const HomePage = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const postListPageNumberSelector = useMemo(
    makePostListPageNumberSelector,
    []
  );
  const postListPageNumber = useSelector(postListPageNumberSelector);
  const numberOfPostsPerPageSelector = useMemo(
    makeNumberOfPostsPerPageSelector,
    []
  );
  const numberOfPostsPerPage = useSelector(numberOfPostsPerPageSelector);
  const visiblePostsIdsSelector = useMemo(makeVisiblePostsIdsSelector, []);
  const visiblePostsIds = useSelector(visiblePostsIdsSelector);

  useEffect(() => {
    dispatch(
      actions.invokeFetchVisiblePostsAndAuthors(
        postListPageNumber,
        numberOfPostsPerPage
      )
    );
  }, [dispatch, postListPageNumber, numberOfPostsPerPage, visiblePostsIds]);

  const renderVisiblePosts = () => {
    const visiblePosts = visiblePostsIds.map((visiblePostId) => (
      <PostPreview key={visiblePostId} id={visiblePostId} />
    ));
    return visiblePosts;
  };

  return (
    <div>
      <Typography variant='h4' className={classes.title}>
        What's New?
      </Typography>
      {renderVisiblePosts()}
    </div>
  );
};

export default HomePage;
