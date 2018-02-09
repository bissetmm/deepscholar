# Data Harvester
## Metadata
```julia
julia arxix_downloader.jl
```

## Systemd Example
### arxiv.service
```
[Unit]
Description = arxiv downloader

[Service]
User = hshindo
ExecStart = /home/hshindo/usr/julia-0.6.0/bin/julia /data/papers/arxiv_downloader.jl

[Install]
WantedBy = multi-user.target
```

### arxiv.timer
```
[Unit]
Description = arxiv downloader

[Timer]
OnCalendar = *-*-* 23:00:00
Persistent = true
Unit = arxiv.service

[Install]
WantedBy = timers.target
```
