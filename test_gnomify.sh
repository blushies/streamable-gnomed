ffmpeg -i /tmp/gnomes/c6eoe.mp4 -i ./gnomed.mp4 -strict -2 -filter_complex \
 "[0:v] scale=iw*min(1920/iw\,1080/ih):ih*min(1920/iw\,1080/ih), pad=1920:1080:(1920-iw*min(1920/iw\,1080/ih))/2:(1080-ih*min(1920/iw\,1080/ih))/2 [v0];
 [1:v] scale=iw*min(1920/iw\,1080/ih):ih*min(1920/iw\,1080/ih), pad=1920:1080:(1920-iw*min(1920/iw\,1080/ih))/2:(1080-ih*min(1920/iw\,1080/ih))/2 [v1];
 [v0] trim=end=10,setpts=PTS-STARTPTS [v2];
 [0:a] atrim=end=10,asetpts=PTS-STARTPTS [a0];
 [v2] [a0] [v1] [1:a] concat=a=1 [v] [a]" \
-map "[v]" -map "[a]" output.mp4

# "[0:v]trim=end=10,setpts=PTS-STARTPTS [v0];
#  [0:a]atrim=end=10,asetpts=PTS-STARTPTS [a0];
