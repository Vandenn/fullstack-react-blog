import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {
  makeUsernameSelector,
  makeUserPictureSelector,
} from 'selectors/entities/users';
import styles from './styles';

const useStyles = makeStyles(styles);

const UserAvatar = (props) => {
  const classes = useStyles();
  const { userId } = props;
  const userPictureSelector = useMemo(makeUserPictureSelector, []);
  const userPicture = useSelector((state) =>
    userPictureSelector(state, { userId })
  );
  const usernameSelector = useMemo(makeUsernameSelector, []);
  const username = useSelector((state) => usernameSelector(state, { userId }));

  if (userPicture) {
    return <Avatar alt={username} src={userPicture} />;
  } else {
    return (
      <Avatar className={classes.defaultAvatar}>
        {username ? username.charAt(0).toUpperCase() : '-'}
      </Avatar>
    );
  }
};

UserAvatar.propTypes = {
  userId: PropTypes.any.isRequired,
};

export default UserAvatar;
