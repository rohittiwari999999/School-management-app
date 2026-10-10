import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:edupulse_sms/features/conference/data/conference_repository.dart';
import 'package:edupulse_sms/features/conference/domain/conference_models.dart';

class LiveConferenceScreen extends ConsumerStatefulWidget {
  final LiveConferenceModel conference;
  final bool isHost;

  const LiveConferenceScreen({
    super.key,
    required this.conference,
    required this.isHost,
  });

  @override
  ConsumerState<LiveConferenceScreen> createState() => _LiveConferenceScreenState();
}

class _LiveConferenceScreenState extends ConsumerState<LiveConferenceScreen> {
  bool _isMicOn = true;
  bool _isVideoOn = true;
  bool _isScreenSharing = false;
  bool _isHandRaised = false;
  bool _showChat = false;
  final TextEditingController _chatController = TextEditingController();

  final List<Map<String, String>> _messages = [
    {'sender': 'Faculty Host', 'text': 'Welcome to today\'s live session! Please keep microphones muted.'},
    {'sender': 'Student Support', 'text': 'Slide presentations and recording will be available in the portal.'},
  ];

  @override
  void dispose() {
    _chatController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add({'sender': widget.isHost ? 'Teacher (You)' : 'You', 'text': text});
      _chatController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 20),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.redAccent,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                Text(
                  widget.conference.title,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ],
            ),
            Text(
              '${widget.conference.subjectName} • ${widget.conference.className} (Room: ${widget.conference.roomCode})',
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(
              _showChat ? Icons.chat_bubble : Icons.chat_bubble_outline,
              color: _showChat ? Colors.blueAccent : Colors.white70,
            ),
            onPressed: () => setState(() => _showChat = !_showChat),
          ),
          IconButton(
            icon: const Icon(Icons.people_alt_outlined, color: Colors.white70),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Active Participants: ${widget.conference.participantsCount + 1}')),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Video Canvas Grid
            Expanded(
              child: Stack(
                children: [
                  Container(
                    margin: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [Colors.blue.shade600, Colors.indigo.shade800],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.blue.withOpacity(0.3),
                                  blurRadius: 20,
                                  spreadRadius: 4,
                                ),
                              ],
                            ),
                            child: Center(
                              child: Text(
                                widget.conference.hostName.substring(0, 1).toUpperCase(),
                                style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            widget.conference.hostName,
                            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.blue.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              widget.conference.hostRole.toUpperCase(),
                              style: const TextStyle(color: Colors.lightBlueAccent, fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          ),
                          if (_isScreenSharing) ...[
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.amber.shade900.withOpacity(0.4),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.amberAccent.withOpacity(0.5)),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.screen_share, color: Colors.amberAccent, size: 16),
                                  SizedBox(width: 6),
                                  Text(
                                    'Host is sharing whiteboard and digital lecture slides',
                                    style: TextStyle(color: Colors.amberAccent, fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),

                  // Floating Self Video PIP
                  Positioned(
                    right: 24,
                    top: 24,
                    child: Container(
                      width: 100,
                      height: 140,
                      decoration: BoxDecoration(
                        color: const Color(0xFF334155),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white24, width: 2),
                        boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 10)],
                      ),
                      child: Stack(
                        children: [
                          Center(
                            child: _isVideoOn
                                ? const Icon(Icons.person, color: Colors.white, size: 40)
                                : const Icon(Icons.videocam_off, color: Colors.white38, size: 32),
                          ),
                          Positioned(
                            bottom: 6,
                            left: 6,
                            child: Text(
                              widget.isHost ? 'You (Host)' : 'You',
                              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          if (!_isMicOn)
                            const Positioned(
                              top: 6,
                              right: 6,
                              child: Icon(Icons.mic_off, color: Colors.redAccent, size: 14),
                            ),
                        ],
                      ),
                    ),
                  ),

                  // Chat Drawer overlay if enabled
                  if (_showChat)
                    Positioned(
                      left: 12,
                      right: 12,
                      bottom: 12,
                      height: 240,
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B).withOpacity(0.95),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.white24),
                        ),
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              decoration: const BoxDecoration(
                                border: Border(bottom: BorderSide(color: Colors.white10)),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'In-Call Messages',
                                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.close, color: Colors.white70, size: 18),
                                    onPressed: () => setState(() => _showChat = false),
                                  ),
                                ],
                              ),
                            ),
                            Expanded(
                              child: ListView.builder(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                itemCount: _messages.length,
                                itemBuilder: (context, idx) {
                                  final m = _messages[idx];
                                  return Padding(
                                    padding: const EdgeInsets.only(bottom: 6),
                                    child: RichText(
                                      text: TextSpan(
                                        children: [
                                          TextSpan(
                                            text: '${m['sender']}: ',
                                            style: const TextStyle(color: Colors.lightBlueAccent, fontWeight: FontWeight.bold, fontSize: 12),
                                          ),
                                          TextSpan(
                                            text: m['text'],
                                            style: const TextStyle(color: Colors.white, fontSize: 12),
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      controller: _chatController,
                                      style: const TextStyle(color: Colors.white, fontSize: 12),
                                      decoration: InputDecoration(
                                        hintText: 'Ask teacher a doubt...',
                                        hintStyle: const TextStyle(color: Colors.white38),
                                        filled: true,
                                        fillColor: const Color(0xFF334155),
                                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(20),
                                          borderSide: BorderSide.none,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  IconButton(
                                    icon: const Icon(Icons.send, color: Colors.blueAccent, size: 20),
                                    onPressed: _sendMessage,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ),

            // In-Call Controller Toolbar (WebRTC Media Bar)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
              decoration: const BoxDecoration(
                color: Color(0xFF1E293B),
                border: Border(top: BorderSide(color: Colors.white12)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Mute / Unmute
                  _buildMediaBtn(
                    icon: _isMicOn ? Icons.mic : Icons.mic_off,
                    active: _isMicOn,
                    label: _isMicOn ? 'Mute' : 'Unmute',
                    onTap: () => setState(() => _isMicOn = !_isMicOn),
                  ),

                  // Video Toggle
                  _buildMediaBtn(
                    icon: _isVideoOn ? Icons.videocam : Icons.videocam_off,
                    active: _isVideoOn,
                    label: _isVideoOn ? 'Stop Cam' : 'Start Cam',
                    onTap: () => setState(() => _isVideoOn = !_isVideoOn),
                  ),

                  // Screen Share
                  _buildMediaBtn(
                    icon: Icons.screen_share,
                    active: _isScreenSharing,
                    label: 'Share',
                    onTap: () {
                      setState(() => _isScreenSharing = !_isScreenSharing);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(_isScreenSharing ? 'Screen broadcasting active' : 'Screen broadcast stopped')),
                      );
                    },
                  ),

                  // Raise Hand
                  _buildMediaBtn(
                    icon: Icons.pan_tool,
                    active: _isHandRaised,
                    label: _isHandRaised ? 'Lower' : 'Raise',
                    activeColor: Colors.amber,
                    onTap: () {
                      setState(() => _isHandRaised = !_isHandRaised);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(_isHandRaised ? 'Hand raised to speak' : 'Hand lowered')),
                      );
                    },
                  ),

                  // Leave / End Button
                  InkWell(
                    onTap: () async {
                      if (widget.isHost) {
                        await ref.read(conferenceRepositoryProvider).endConference(widget.conference.sessionId);
                      }
                      if (context.mounted) {
                        Navigator.of(context).pop();
                      }
                    },
                    borderRadius: BorderRadius.circular(30),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.red.shade600,
                        borderRadius: BorderRadius.circular(30),
                        boxShadow: [BoxShadow(color: Colors.red.withOpacity(0.4), blurRadius: 8)],
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.call_end, color: Colors.white, size: 18),
                          const SizedBox(width: 6),
                          Text(
                            widget.isHost ? 'End Call' : 'Leave',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMediaBtn({
    required IconData icon,
    required bool active,
    required String label,
    required VoidCallback onTap,
    Color activeColor = Colors.white,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: active ? const Color(0xFF334155) : Colors.red.shade900.withOpacity(0.5),
                shape: BoxShape.circle,
                border: Border.all(color: active ? Colors.white24 : Colors.redAccent.withOpacity(0.5)),
              ),
              child: Icon(icon, color: active ? activeColor : Colors.redAccent, size: 20),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(color: active ? Colors.white70 : Colors.redAccent, fontSize: 10, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }
}
