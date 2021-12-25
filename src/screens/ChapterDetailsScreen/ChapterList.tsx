import QuicksandText from "@/components/Common/QuicksandText";
import { HomeNavigationProps } from "@/navigator/Main/BottomMenu";
import {
  chapterListcomicDetailsProps,
  chapterListComicDetailsTopBarNavigation,
  chapterListComicDetailsTopBarProps,
} from "@/navigator/Main/ComicDetailsTopTabNavigator";
import { MainNavigationProps } from "@/navigator/StackNavigator";
import { resComicDetailChapterItem_T } from "@/types/api";
import { useNavigation } from "@react-navigation/native";
import { BottomNavigation, Layout } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import {
  ListRenderItemInfo,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useApiChapter, useApiComicDetail } from "../../app/api";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from "expo-notifications";
import { downloadToFolder } from "expo-file-dl";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  downloadAction,
  downloadComicThunk,
  downloadSelector,
} from "../../app/downloadSlice";
import { useDownloadComic } from "../../app/notification";
import { selectHome } from "../../app/homeSlice";
import { addMultipleImgs } from "@/utils/Download/ImgManager";

// import { useDownloadComic } from "App";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// const channelId = "DownloadInfo";

const ChapterList: React.FunctionComponent<
  chapterListcomicDetailsProps | undefined
> = (props) => {
  const { data, isFetching, isLoading } = useApiComicDetail(
    props.route.params.path,
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  const chapter1Details = useApiChapter(data?.chapters[0]?.path || "");
  console.log(
    "🚀 ~ file: ChapterList.tsx ~ line 52 ~ chapter1Details",
    chapter1Details
  );
  // console.log(
  //   "🚀 ~ file: ChapterList.tsx ~ line 22 ~   props.route.params.path",
  //   props.route.params.path
  // );
  const navigator = useNavigation<HomeNavigationProps>();

  // const [uri, setUri] = useState(
  //   "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png"
  // );
  // const [filename, setFilename] = useState("");
  // const [downloadProgress, setDownloadProgress] = useState("0%");

  // async function setNotificationChannel() {
  //   const loadingChannel: NotificationChannel | null =
  //     await Notifications.getNotificationChannelAsync(channelId);

  //   // if we didn't find a notification channel set how we like it, then we create one
  //   if (loadingChannel == null) {
  //     const channelOptions: NotificationChannelInput = {
  //       name: channelId,
  //       importance: AndroidImportance.HIGH,
  //       lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
  //       sound: "default",
  //       vibrationPattern: [250],
  //       enableVibrate: true,
  //     };
  //     await Notifications.setNotificationChannelAsync(
  //       channelId,
  //       channelOptions
  //     );
  //   }
  // }

  // useEffect(() => {
  //   setNotificationChannel();
  // });

  // // IMPORTANT: You MUST obtain MEDIA_LIBRARY permissions for the file download to succeed
  // // If you don't the downloads will fail
  // async function getMediaLibraryPermissions() {
  //   await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  // }

  // // You also MUST obtain NOTIFICATIONS permissions to show any notification
  // // to the user. Please read the docs for more on permissions for notifications
  // // https://docs.expo.io/versions/latest/sdk/notifications/#fetching-information-about-notifications-related-permissions
  // async function getNotificationPermissions() {
  //   await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // }

  // const downloadProgressUpdater = ({
  //   totalBytesWritten,
  //   totalBytesExpectedToWrite,
  // }: {
  //   totalBytesWritten: number;
  //   totalBytesExpectedToWrite: number;
  // }) => {
  //   const pctg = 100 * (totalBytesWritten / totalBytesExpectedToWrite);
  //   setDownloadProgress(`${pctg.toFixed(0)}%`);
  // };

  // useEffect(() => {
  //   getMediaLibraryPermissions();
  // });

  // useEffect(() => {
  //   getNotificationPermissions();
  // });

  // async function handleDownload() {
  //   // You can also call downloadToFolder with custom notification content, or without any notifications sent at all

  //   // ***************************
  //   // custom notification content
  //   // ***************************
  //   // const customNotifInput: {downloading: NotificationContentInput, finished: NotificationContentInput, error: NotificationContentInput} = {
  //   //   downloading: { title: "Custom title 1", body: 'Custom body 1', color: '#06004a' },
  //   //   finished: { title: "Custom title 2", body: 'Custom body 2', color: '#004a00' },
  //   //   error: { title: "Custom title 3", body: 'Custom body 3', color: '#810002' }
  //   // };
  //   // await downloadToFolder(uri, filename, "Download", channelId, { notificationType: { notification: "custom" }, notificationContent: customNotifInput });

  //   // ****************
  //   // no notifications
  //   // ****************
  //   // await downloadToFolder(uri, filename, "Download", channelId, { notificationType: { notification: "none" }});

  //   // *******
  //   // default
  //   // *******
  //   await downloadToFolder(uri, filename, "Download", channelId, {
  //     downloadProgressCallback: downloadProgressUpdater,
  //   });
  // }
  const { uriList, setUriList, setComic, setChapter, run } = useDownloadComic();

  // const download = useAppSelector(downloadSelector);
  const home = useAppSelector(selectHome);
  const dispatch = useAppDispatch();

  return (
    <FlatList
      data={isFetching ? [] : data?.chapters}
      renderItem={(item: ListRenderItemInfo<resComicDetailChapterItem_T>) => (
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <TouchableOpacity
            onPress={() =>
              navigator.navigate("Chapter", { path: item.item.path })
            }
          >
            <QuicksandText>{item.item.name}</QuicksandText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              dispatch(downloadComicThunk(item.item.path));
              // console.log(
              //   "🚀 ~ file: ChapterList.tsx ~ line 181 ~ onPress={ ~ home?.currentComic",
              //   home?.currentComic
              // );
              // ToastAndroid.show(
              //   `START ${chapter1Details.data?.data.images[0]}`,
              //   ToastAndroid.SHORT
              // );
              // const fileUrls = await addMultipleImgs(
              //   chapter1Details.data?.data.images || []
              // );
              // ToastAndroid.show("end", ToastAndroid.SHORT);

              // dispatch(downloadAction.newComic(home?.currentComic));
              // dispatch(
              //   downloadAction.saveChapter({
              //     chapter: chapter1Details.data?.data,
              //     fileUrls: fileUrls || [],
              //   })
              // );
              // console.log(
              //   "🚀 ~ file: ChapterList.tsx ~ line 188 ~ onPress={ ~ chapter1Details.data?.data.images",
              //   chapter1Details.data?.data.images
              // );
              // setChapter(chapter1Details.data?.data);
              // setUriList(() => chapter1Details.data?.data.images);
              // setComic(home?.currentComic || undefined);

              // await run();

              // console.log(
              //   "############",
              //   download.comics[Object.keys(download.comics)[0]]?.savedChapter
              // );
              // console.log("############", download.comics);
              // Object.keys(download.comics).forEach((e) => console.log(e));
              ToastAndroid.show("done", ToastAndroid.SHORT);
            }}
          >
            <QuicksandText>download</QuicksandText>
          </TouchableOpacity>
        </Layout>
      )}
    />
  );
};

export default ChapterList;